import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      keys: ['Spacebar'],
      action: 'Toggle Microphone / Interrupt Speech',
      detail:
        'When not typing in a text field, Spacebar opens the microphone. While Sensei is speaking, pressing Spacebar immediately interrupts speech to ask a doubt.'
    },
    {
      keys: ['Esc'],
      action: 'Immediate Audio Stop',
      detail: 'Immediately halts text-to-speech read aloud and silences the synthesizer.'
    },
    {
      keys: ['1', '2', '3', '4'],
      action: 'Switch Study Kit Tabs',
      detail: '1: Quick Notes, 2: Flashcards, 3: Concept Mindmap, 4: Adaptive Quiz.'
    },
    {
      keys: ['←', '→'],
      action: 'Navigate Flashcards',
      detail: 'Cycles through interactive multi-sensory flashcards.'
    },
    {
      keys: ['Enter'],
      action: 'Flip Flashcard',
      detail: 'Flips between question and answer on the focused flashcard.'
    },
    {
      keys: ['Tab', 'Shift+Tab'],
      action: 'Accessible Element Traversal',
      detail: 'Navigates focusable buttons, controls, and radio groups with high-contrast outlines.'
    }
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 id="shortcuts-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                Keyboard Accessibility Shortcuts
              </h3>
              <p className="text-xs text-slate-500">Universal hands-free & motor-assist controls</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 transition-colors"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-5 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {sc.action}
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {sc.detail}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {sc.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs shadow-xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
