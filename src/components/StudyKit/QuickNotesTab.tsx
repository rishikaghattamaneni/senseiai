import React, { useState } from 'react';
import {
  Copy,
  Check,
  FileText,
  AlertTriangle,
  Lightbulb,
  Binary,
  Volume2
} from 'lucide-react';
import { QuickNotes } from '../../types';

interface QuickNotesTabProps {
  notes: QuickNotes;
  onReadAloud: (text: string) => void;
}

export const QuickNotesTab: React.FC<QuickNotesTabProps> = ({
  notes,
  onReadAloud
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyNotes = () => {
    const formatted = `# ${notes.title}\n\n${notes.summary}\n\n## Key Takeaways\n${notes.keyPoints.map((p) => `- ${p}`).join('\n')}\n\n## Formulas & Rules\n${notes.formulasOrRules.map((f) => `- ${f}`).join('\n')}\n\n## Common Misconceptions\n${notes.commonMisconceptions.map((m) => `- ${m}`).join('\n')}\n\nPro-Tip: ${notes.proTip}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const readNotesSummary = () => {
    const textToRead = `${notes.title}. Summary: ${notes.summary}. Key points: ${notes.keyPoints.join('. ')}. Pro tip: ${notes.proTip}`;
    onReadAloud(textToRead);
  };

  return (
    <article aria-labelledby="quick-notes-title" className="space-y-6">
      {/* Top Header & Copy Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Study Kit Component 1 of 4
          </span>
          <h3
            id="quick-notes-title"
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5"
          >
            {notes.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed max-w-3xl">
            {notes.summary}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Read Aloud Button */}
          <button
            onClick={readNotesSummary}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-1.5 transition-colors shadow-xs"
            aria-label="Read full notes summary aloud"
          >
            <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span className="hidden sm:inline">Read Aloud</span>
          </button>

          {/* Copy Notes Button */}
          <button
            onClick={handleCopyNotes}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            aria-label={copied ? 'Notes copied to clipboard' : 'Copy notes to clipboard'}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>Copy Notes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Screen Reader Live Confirmation */}
      <div className="sr-only" aria-live="polite">
        {copied ? 'Notes copied to clipboard successfully' : ''}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Key Points (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Core Takeaways & Concepts
            </h4>
            <ul className="space-y-3">
              {notes.keyPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                >
                  <span
                    className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-indigo-200 dark:border-indigo-800"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div>{point}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Formulas and Governing Rules */}
          {notes.formulasOrRules && notes.formulasOrRules.length > 0 && (
            <div className="bg-indigo-50/60 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 p-5 shadow-xs">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Binary className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Formulas & Governing Laws
              </h4>
              <div className="space-y-2">
                {notes.formulasOrRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/60 text-sm font-mono text-slate-800 dark:text-slate-200"
                  >
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Misconceptions & Pro Tips */}
        <div className="space-y-4">
          {/* Common Misconceptions */}
          {notes.commonMisconceptions && notes.commonMisconceptions.length > 0 && (
            <div className="bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800/80 p-5 shadow-xs">
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Common Traps & Misconceptions
              </h4>
              <ul className="space-y-3">
                {notes.commonMisconceptions.map((mis, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-l-2 border-amber-400 pl-3"
                  >
                    {mis}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actionable Pro-Tip */}
          {notes.proTip && (
            <div className="bg-emerald-50/70 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 p-5 shadow-xs">
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Sensei Pro-Tip Mnemonic
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{notes.proTip}"
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};


