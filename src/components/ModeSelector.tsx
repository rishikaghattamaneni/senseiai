import React from 'react';
import { HelpCircle, Lightbulb, Zap, Check } from 'lucide-react';
import { TutorMode } from '../types';

interface ModeSelectorProps {
  currentMode: TutorMode;
  onSelectMode: (mode: TutorMode) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  disabled = false
}) => {
  const modes: Array<{
    id: TutorMode;
    title: string;
    badge: string;
    icon: React.ReactNode;
    description: string;
    bestFor: string;
    color: string;
    activeBorder: string;
  }> = [
    {
      id: 'socratic',
      title: 'Socratic Tutor',
      badge: 'Step-by-Step Inquiry',
      icon: <HelpCircle className="w-5 h-5 text-sky-500" aria-hidden="true" />,
      description:
        'Interactive step-by-step guidance that asks thoughtful leading questions to help you derive the answers yourself.',
      bestFor: 'Deep conceptual grasp & critical thinking',
      color: 'sky',
      activeBorder: 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/50 dark:bg-sky-950/20'
    },
    {
      id: 'eli5',
      title: 'ELI5 Analogy',
      badge: 'Everyday Metaphors',
      icon: <Lightbulb className="w-5 h-5 text-amber-500" aria-hidden="true" />,
      description:
        'Uses everyday real-world analogies, vivid stories, and simple non-jargon language for fast, intuitive understanding.',
      bestFor: 'Visual/creative thinkers & diverse-paced learners',
      color: 'amber',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20'
    },
    {
      id: 'exam',
      title: 'Exam Sprint',
      badge: 'High-Yield Revision',
      icon: <Zap className="w-5 h-5 text-indigo-500" aria-hidden="true" />,
      description:
        'Crisp structured bullet points, formula breakdowns, definitions, and trap alerts for rapid high-retention mastery.',
      bestFor: 'Quick revision, test prep & structured summaries',
      color: 'indigo',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/20'
    }
  ];

  return (
    <section aria-labelledby="learning-style-heading" className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
        <div>
          <h2 id="learning-style-heading" className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
            Personalized Learning Style & Pace
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose how SenseiAI adapts its pedagogy, tone, and multi-sensory materials for you.
          </p>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="Teaching mode selector"
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
      >
        {modes.map((m) => {
          const isSelected = currentMode === m.id;
          return (
            <button
              key={m.id}
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelectMode(m.id)}
              className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? `${m.activeBorder} shadow-sm`
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/70 dark:bg-slate-900/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xs'}`}
            >
              {isSelected && (
                <div
                  className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs"
                  aria-hidden="true"
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    {m.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {m.title}
                    </h3>
                    <span className="text-[10px] font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {m.badge}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Ideal for:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                  {m.bestFor}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

