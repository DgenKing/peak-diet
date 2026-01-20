import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { DayOfWeek, WeeklySchedule, DietPlan } from '../../types/diet';
import { processChatRequest } from '../../services/ai';

interface ChatScreenProps {
  schedule: WeeklySchedule;
  onUpdatePlan: (day: DayOfWeek, plan: DietPlan) => void;
  onBack: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isSystem?: boolean;
}

export function ChatScreen({ schedule, onUpdatePlan, onBack }: ChatScreenProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI Nutrition Assistant. I can help you with general advice, or we can edit your weekly plans. Try asking 'What's a healthy snack?' or 'Change Monday's lunch to sushi'." }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const result = await processChatRequest(userMsg, schedule);
      
      setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);

      if (result.action === 'update' && result.targetDay && result.updatedPlan) {
         onUpdatePlan(result.targetDay as DayOfWeek, result.updatedPlan);
         setMessages(prev => [...prev, { 
             role: 'assistant', 
             content: `✅ I've updated your plan for ${result.targetDay}.`,
             isSystem: true 
         }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I ran into an error processing that request." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30 flex items-center gap-3">
        <button onClick={onBack} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold">AI Assistant</h1>
          <p className="text-xs text-gray-500">Coach & Editor</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`
                max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : msg.isSystem
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800'
                    : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-bl-none shadow-sm'
                }
              `}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl rounded-bl-none p-4 shadow-sm">
               <div className="flex gap-1.5">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 z-30">
        <div className="max-w-md mx-auto flex gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            disabled={loading}
            autoFocus
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
