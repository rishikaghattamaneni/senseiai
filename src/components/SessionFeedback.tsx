import React, { useState } from 'react';
import { ThumbsUp, HelpCircle, ThumbsDown, Check, Send } from 'lucide-react';
import { TutorMode } from '../types';

interface SessionFeedbackProps {
  topic: string;
  currentMode: TutorMode;
  onSubmitFeedback: (rating: 'yes' | 'somewhat' | 'no', comment: string) => void;
}

export const SessionFeedback: React.FC<SessionFeedbackProps> = ({
  topic,
  currentMode,
  onSubmitFeedback
}) => {
  const [selectedRating, setSelectedRating] = useState<'yes' | 'somewhat' | 'no' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating) return;
    onSubmitFeedback(selectedRating, comment.trim());
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center">
        <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Feedback Recorded! Thank you for helping improve SenseiAI.</span>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="feedback-tracker-title"
      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h4
            id="feedback-tracker-title"
            className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"
          >
            <span>Did SenseiAI help you understand "{topic}"?</span>
          </h4>
          <p className="text-xs text-slate-500">
            Your honest feedback updates the PM Impact Metrics telemetry in real-time.
          </p>
        </div>

        {/* Rating Options */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedRating('yes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              selectedRating === 'yes'
                ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200'
            }`}
            aria-pressed={selectedRating === 'yes'}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Yes, Got It!</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRating('somewhat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              selectedRating === 'somewhat'
                ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200'
            }`}
            aria-pressed={selectedRating === 'somewhat'}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Somewhat</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRating('no')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              selectedRating === 'no'
                ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200'
            }`}
            aria-pressed={selectedRating === 'no'}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Not Yet</span>
          </button>
        </div>
      </div>

      {selectedRating && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment: What clicked, or what could be clearer? (Space key works normally here)"
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3 h-3" />
            <span>Submit</span>
          </button>
        </form>
      )}
    </section>
  );
};


