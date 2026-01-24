# Meal Editor Feature Plan

## Overview
Add ability to click on individual meal cards to edit just that meal with focused AI, while keeping the existing full-day chat.

---

## User Flow

```
Dashboard Screen (current)
    │
    ├── Tap Meal Card (e.g., "Breakfast")
    │       │
    │       └── Opens Meal Editor Modal
    │               │
    │               ├── Shows current meal items
    │               ├── Text input: "What do you want to change?"
    │               ├── [Update Meal] button
    │               │
    │               └── AI updates ONLY this meal
    │                       │
    │                       └── Returns to Dashboard with updated meal
    │
    └── Bottom Chat (unchanged)
            │
            └── Still works for full-day edits
```

---

## Components to Create

### 1. MealEditorModal.tsx
New modal component for editing a single meal.

**Props:**
```typescript
interface MealEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;                    // Current meal data
  mealIndex: number;             // Position in meals array
  dailyTargets: DailyTargets;    // For context to AI
  onMealUpdated: (updatedMeal: Meal) => void;
}
```

**UI Layout:**
```
┌─────────────────────────────────┐
│ ← Edit Breakfast            X  │
├─────────────────────────────────┤
│                                 │
│ Current items:                  │
│ ┌─────────────────────────────┐ │
│ │ • Scrambled eggs (150g)     │ │
│ │ • Oatmeal with yogurt (1cup)│ │
│ │ • Orange juice (200ml)      │ │
│ └─────────────────────────────┘ │
│                                 │
│ Macros: 450 cal | 28P | 45C | 18F│
│                                 │
│ ─────────────────────────────── │
│                                 │
│ What do you want to change?     │
│ ┌─────────────────────────────┐ │
│ │ "swap eggs for bacon"       │ │
│ └─────────────────────────────┘ │
│                                 │
│      [ Update Meal ]            │
│                                 │
└─────────────────────────────────┘
```

---

### 2. updateMeal() AI Function
New function in `src/utils/api.ts` (or new file).

**Input:**
```typescript
interface UpdateMealRequest {
  meal: Meal;                    // Current meal
  instruction: string;           // User's change request
  dailyTargets: DailyTargets;    // Keep macros in range
  mealName: string;              // "Breakfast", "Lunch", etc.
}
```

**Output:**
```typescript
// Returns updated Meal object with recalculated macros
Meal
```

**AI Prompt Strategy:**
```
You are updating a single meal in a diet plan.

Current meal ({mealName}):
{JSON of current meal}

Daily targets: {calories}cal, {protein}g protein, {carbs}g carbs, {fats}g fats

User wants: "{instruction}"

Return the updated meal with:
- Updated items list
- Recalculated totalMacros
- Keep the meal name and time
- Stay within reasonable proportion of daily targets

Return JSON only, no explanation.
```

---

## Files to Modify

### 1. src/components/screens/DashboardScreen.tsx
- Add `onClick` handler to meal cards
- Add state for selected meal and modal visibility
- Import and render MealEditorModal

**Changes:**
```typescript
// Add state
const [editingMeal, setEditingMeal] = useState<{meal: Meal, index: number} | null>(null);

// Add click handler to meal card
<div
  className="meal-card cursor-pointer hover:ring-2 hover:ring-primary"
  onClick={() => setEditingMeal({ meal, index })}
>

// Add modal
{editingMeal && (
  <MealEditorModal
    isOpen={!!editingMeal}
    onClose={() => setEditingMeal(null)}
    meal={editingMeal.meal}
    mealIndex={editingMeal.index}
    dailyTargets={currentPlan.dailyTargets}
    onMealUpdated={(updatedMeal) => {
      // Update the meal in the plan
      const newMeals = [...currentPlan.meals];
      newMeals[editingMeal.index] = updatedMeal;
      // Update state/store
      setEditingMeal(null);
    }}
  />
)}
```

### 2. src/utils/api.ts (or new file)
- Add `updateMeal()` function
- Similar structure to existing `updateDietPlan()`

---

## Implementation Steps

### Step 1: Create AI function
- [ ] Add `updateMeal()` to api.ts
- [ ] Test with hardcoded data

### Step 2: Create Modal component
- [ ] Create `src/components/MealEditorModal.tsx`
- [ ] Style to match app theme
- [ ] Add loading state during AI call
- [ ] Handle errors

### Step 3: Wire up Dashboard
- [ ] Make meal cards clickable
- [ ] Add modal state management
- [ ] Handle meal update callback
- [ ] Update store/localStorage

### Step 4: Test
- [ ] Test editing each meal type
- [ ] Test various instructions (swap, add, remove, adjust)
- [ ] Verify macros recalculate correctly
- [ ] Verify changes persist

---

## Edge Cases to Handle

1. **AI returns invalid JSON** - Show error, keep modal open
2. **AI changes wrong things** - Prompt is specific to single meal
3. **User cancels mid-edit** - Discard changes, close modal
4. **Loading state** - Show spinner, disable button
5. **Empty instruction** - Disable button until text entered

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Breaks existing chat | Chat code untouched, only adding onClick to cards |
| Modal styling issues | Use existing Tailwind patterns from app |
| AI returns bad data | Zod validation on response |
| State sync issues | Use same update pattern as existing chat |

**Overall Risk: LOW** - All changes are additive.

---

## Success Criteria

- [x] Can tap any meal card to open editor
- [x] Can type instruction and get updated meal
- [x] Macros recalculate correctly
- [x] Changes save to localStorage
- [x] Existing bottom chat still works
- [x] Mobile-friendly modal
- [x] AI tries to balance meal macros when swapping items
- [x] AI updates cooking tips when items change

---

## Known Issues / Next Steps

### ~~Tips still reference weird combos~~ ✅ FIXED
~~When the original meal has a strange combination (e.g., eggs + milk mix + golden syrup), the tip tries to make sense of it but fails.~~

**Solution implemented:** Updated AI prompt to focus tips on the MAIN protein/item only with a short, practical cooking instruction (1 sentence max). Tips no longer try to explain how to combine all items.

Example: "Pan-fry chicken sausages over medium heat for 8-10 minutes until browned and cooked through."

### Macro balancing limitations
When swapping a small item for a much larger one (e.g., 50g chicken → 200g chicken), the AI reduces other items but can't fully compensate if there's not enough to reduce.

**This is acceptable behavior** - the AI prioritizes the user's request over perfect balancing.

---

## Future Enhancements (not in scope)

- Quick action buttons ("Make vegetarian", "Add protein", "Reduce carbs")
- Swipe to edit on mobile
- Undo last change
- Edit history
- Better tip generation for mixed meals
