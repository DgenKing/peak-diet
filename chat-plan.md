# Conversational Chat Implementation Plan

## Overview
Add a conversational AI chat interface that allows users to discuss their diet, ask questions, and get advice - but with strict guardrails to prevent accidental diet plan modifications.

## Core Principle
**Read vs Write Separation**: The chat should freely answer questions and provide advice, but any actual changes to the diet plan require explicit user confirmation.

---

## Architecture

### 1. Chat Modes

```
CONVERSATIONAL (default)
- Answer questions about nutrition
- Explain why certain foods are in the plan
- Provide tips and motivation
- Discuss alternatives (without applying them)
- NO changes to the plan

MODIFICATION (requires explicit intent)
- User must clearly request a change
- System detects modification intent
- Shows preview of changes
- Requires confirmation before applying
```

### 2. Intent Detection

**Conversational Intents (No Confirmation Needed)**
- "Why is chicken in my breakfast?"
- "What's the protein content of this meal?"
- "Is this plan good for muscle building?"
- "Tell me about intermittent fasting"
- "What can I substitute for eggs?" (just asking, not changing)

**Modification Intents (Requires Confirmation)**
- "Swap chicken for tofu"
- "Remove the eggs from breakfast"
- "Add more protein to lunch"
- "Change my calories to 2000"
- "Make this meal vegetarian"

### 3. Detection Keywords/Patterns

```typescript
const MODIFICATION_PATTERNS = [
  /\b(swap|replace|change|switch|substitute)\b.*\b(for|with|to)\b/i,
  /\b(remove|delete|take out|get rid of)\b/i,
  /\b(add|include|put|insert)\b.*\b(to|in|into)\b/i,
  /\b(increase|decrease|raise|lower|reduce)\b.*\b(calories|protein|carbs|fats)\b/i,
  /\b(make|convert)\b.*\b(vegetarian|vegan|keto|low.?carb)\b/i,
  /\b(update|modify|edit|adjust)\b.*\b(plan|meal|diet)\b/i,
];
```

---

## Implementation Steps

### Phase 1: Chat Infrastructure

**File: `src/services/chat.ts`**
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    isModificationRequest?: boolean;
    pendingChanges?: DietPlan;
    confirmed?: boolean;
  };
}

interface ChatSession {
  messages: ChatMessage[];
  currentPlan: DietPlan;
  dayName?: DayOfWeek;
}
```

**Functions to implement:**
- `detectIntent(message: string): 'conversational' | 'modification'`
- `generateConversationalResponse(session: ChatSession, userMessage: string): Promise<string>`
- `generateModificationPreview(session: ChatSession, userMessage: string): Promise<{ preview: DietPlan, explanation: string }>`

### Phase 2: UI Components

**File: `src/components/chat/ChatInterface.tsx`**
- Full-screen or slide-up chat panel
- Message history with bubbles
- Input field at bottom
- Shows "Thinking..." while AI responds

**File: `src/components/chat/ModificationConfirmation.tsx`**
- Shows before/after diff of changes
- "Apply Changes" / "Cancel" buttons
- Explanation of what will change

### Phase 3: Integration Points

1. **DietDashboardScreen** - Replace simple input with ChatInterface
2. **WeeklyPlannerScreen** - Add global chat button for general questions
3. **useDietStore** - Add chat history persistence (optional)

---

## Prompt Engineering

### System Prompt for Conversational Mode
```
You are a friendly nutrition assistant for PeakDiet. The user has a diet plan and may ask questions about it.

IMPORTANT RULES:
1. Answer questions helpfully and conversationally
2. If asked about substitutions, explain options but DO NOT modify the plan
3. If the user wants to make a change, tell them to phrase it as a direct request like "Swap X for Y"
4. Never output JSON or structured data - just natural conversation
5. Be encouraging and supportive

Current Plan Context:
{planSummary}
```

### System Prompt for Modification Mode
```
The user wants to modify their diet plan. Analyze their request and return a JSON response.

Current Plan:
{currentPlanJSON}

User Request: {userMessage}

Return JSON with:
{
  "understood": true/false,
  "explanation": "What changes will be made",
  "updatedPlan": { ...modified plan... }
}

If the request is unclear, set understood: false and ask for clarification in the explanation.
```

---

## User Flow

```
User types: "Why do I have eggs for breakfast?"
→ Intent: CONVERSATIONAL
→ AI responds with explanation
→ No confirmation needed

User types: "Can I have something else instead of eggs?"
→ Intent: CONVERSATIONAL (asking, not commanding)
→ AI suggests alternatives, mentions "Say 'swap eggs for X' to make the change"

User types: "Swap eggs for Greek yogurt"
→ Intent: MODIFICATION
→ AI generates preview
→ Show confirmation modal:
   "Replace eggs (2 large) with Greek yogurt (200g)
    Calories: 140 → 130
    Protein: 12g → 20g"
   [Apply] [Cancel]
→ User clicks Apply
→ Plan updated
```

---

## API Calls

### Conversational (Cheap/Fast)
- Use streaming for better UX
- Could use lighter model if available
- No JSON parsing needed

### Modification (Careful/Accurate)
- Use current updateDietPlan approach
- Zod validation on response
- Retry on parse failure

---

## Files to Create/Modify

### New Files
- `src/services/chat.ts` - Chat logic and intent detection
- `src/components/chat/ChatInterface.tsx` - Main chat UI
- `src/components/chat/ChatBubble.tsx` - Individual message component
- `src/components/chat/ModificationPreview.tsx` - Change confirmation
- `src/hooks/useChatSession.ts` - Chat state management

### Modified Files
- `src/components/screens/DietDashboardScreen.tsx` - Integrate chat
- `src/services/ai.ts` - Add conversational endpoint
- `src/types/chat.ts` - Type definitions

---

## Edge Cases

1. **Ambiguous requests**: "I don't like this" → Ask for specifics
2. **Multiple changes**: "Swap eggs for yogurt and add more protein" → Handle sequentially or as batch
3. **Impossible changes**: "Make this 5000 calories but low carb" → Explain conflict
4. **Undo requests**: "Go back to the original" → Need to track history

---

## Future Enhancements

- Voice input
- Quick action buttons ("Make vegetarian", "Add snack")
- Chat history across sessions
- Share conversation with nutritionist
- Meal photo analysis ("What's in this?")

---

## Priority Order

1. Intent detection (Phase 1)
2. Confirmation UI for modifications (Phase 2)
3. Chat message history (Phase 2)
4. Full chat interface (Phase 2)
5. Persistence (Phase 3)
