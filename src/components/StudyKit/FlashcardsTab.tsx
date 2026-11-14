import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Flashcard } from '../../types';

interface FlashcardsTabProps {
  cards: Flashcard[];
  onReadAloud: (text: string) => void;
}

export const FlashcardsTab: React.FC<FlashcardsTabProps> = ({
  cards,
  onReadAloud
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when changing card
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  if (!cards || cards.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No flashcards generated yet for this topic.
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleReadAloud = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    const text = isFlipped
      ? `Answer: ${currentCard.answer}. Memory tip: ${currentCard.memoryHook || ''}`
      : `Question: ${currentCard.question}. Flip card to reveal the answer.`;
    onReadAloud(text);
  };

  // Keyboard navigation when user is focused on flashcard area
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleFlip();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key.toLowerCase() === 'r') {
      e.preventDefault();
      const text = isFlipped
        ? `Answer: ${currentCard.answer}`
        : `Question: ${currentCard.question}`;
      onReadAloud(text);
    }
  };

  return (
    <article aria-labelledby="flashcards-heading" className="space-y-6">
      {/* Tab Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Study Kit Component 2 of 4
          </span>
          <h3
            id="flashcards-heading"
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5"
          >
            Multi-Sensory Interactive Flashcards
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Tap or press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-mono">Enter</kbd> to flip.
            Use <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-mono">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs font-mono">→</kbd> to cycle.
          </p>
        </div>

        {/* Card Progress Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Card {currentIndex + 1} of {cards.length}
          </span>
        </div>
      </div>

      {/* Main Flashcard Container with 3D Flip */}
      <div className="flex flex-col items-center justify-center">
        <div
          tabIndex={0}
          role="button"
          aria-label={`Flashcard ${currentIndex + 1} of ${cards.length}. ${isFlipped ? 'Answer side visible' : 'Question side visible'}. Press Enter or Space to flip, R to read aloud.`}
          onKeyDown={handleKeyDown}
          onClick={handleFlip}
          className="w-full max-w-2xl h-80 sm:h-96 perspective-1000 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500 rounded-3xl"
        >
          <div
            className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* FRONT OF CARD (Question) */}
            <div className="absolute w-full h-full backface-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-indigo-200 dark:border-indigo-800 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Question (Front)
                </span>
                <button
                  type="button"
                  onClick={handleReadAloud}
                  className="p-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 shadow-xs"
                  aria-label="Read question aloud"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline">Read Aloud</span>
                </button>
              </div>

              <div className="my-auto text-center px-4">
                <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                  {currentCard.question}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" /> Click or tap to reveal answer
                </span>
                <span className="font-mono text-[11px]">[Space / Enter to flip]</span>
              </div>
            </div>

            {/* BACK OF CARD (Answer) */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-2 border-indigo-500 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Answer (Back)
                </span>
                <button
                  type="button"
                  onClick={handleReadAloud}
                  className="p-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 shadow-xs"
                  aria-label="Read answer aloud"
                >
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Read Aloud</span>
                </button>
              </div>

              <div className="my-auto px-4 space-y-4">
                <p className="text-base sm:text-xl font-medium text-slate-100 leading-relaxed">
                  {currentCard.answer}
                </p>
                {currentCard.memoryHook && (
                  <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-xs sm:text-sm text-amber-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>
                      <strong className="font-bold">Memory Hook:</strong> {currentCard.memoryHook}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 border-t border-white/10 pt-3">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" /> Click to flip back
                </span>
                <span className="font-mono text-[11px]">[← / → for next card]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Toolbar */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs flex items-center gap-2 font-bold text-sm transition-all"
            aria-label="Previous flashcard"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={handleFlip}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
            aria-label="Flip card"
          >
            <RotateCw className="w-4 h-4" />
            <span>Flip Card</span>
          </button>

          <button
            onClick={handleNext}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-xs flex items-center gap-2 font-bold text-sm transition-all"
            aria-label="Next flashcard"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
};
