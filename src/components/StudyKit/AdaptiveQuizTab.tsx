import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  Volume2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Target,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, QuizSubmission } from '../../types';

interface AdaptiveQuizTabProps {
  questions: QuizQuestion[];
  topic: string;
  onReadAloud: (text: string) => void;
  onSubmitQuiz: (submission: QuizSubmission) => void;
  onFixGaps: (missedQuestions: QuizQuestion[], missedConcepts: string[]) => Promise<string>;
}

export const AdaptiveQuizTab: React.FC<AdaptiveQuizTabProps> = ({
  questions,
  topic,
  onReadAloud,
  onSubmitQuiz,
  onFixGaps
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState(false);
  const [remedialLesson, setRemedialLesson] = useState<string | null>(null);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        No quiz questions generated for this topic.
      </div>
    );
  }

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleReadQuestion = (q: QuizQuestion) => {
    const text = `Question: ${q.question}. Option 1: ${q.options[0]}. Option 2: ${q.options[1]}. Option 3: ${q.options[2]}. Option 4: ${q.options[3]}.`;
    onReadAloud(text);
  };

  const calculateScore = () => {
    let score = 0;
    const missed: QuizQuestion[] = [];
    const missedConcepts: string[] = [];

    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      if (selected === q.correctIndex) {
        score += 1;
      } else {
        missed.push(q);
        if (!missedConcepts.includes(q.conceptTag)) {
          missedConcepts.push(q.conceptTag);
        }
      }
    });

    return { score, missed, missedConcepts };
  };

  const handleSubmit = () => {
    const { score, missed, missedConcepts } = calculateScore();
    setIsSubmitted(true);

    if (score === questions.length) {
      // Fire confetti if perfect score!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti is non-critical
      }
    }

    const submission: QuizSubmission = {
      score,
      total: questions.length,
      userAnswers: selectedAnswers,
      missedQuestionIds: missed.map((q) => q.id),
      missedConcepts,
      timestamp: Date.now()
    };

    onSubmitQuiz(submission);
  };

  const handleTriggerFixGaps = async () => {
    const { missed, missedConcepts } = calculateScore();
    if (missed.length === 0) return;

    setIsGeneratingLesson(true);
    try {
      const lesson = await onFixGaps(missed, missedConcepts);
      setRemedialLesson(lesson);
      // Read brief summary aloud
      onReadAloud(`Targeted gap-filler lesson ready. Addressing missed concepts: ${missedConcepts.join(', ')}.`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setRemedialLesson(null);
  };

  const { score, missed, missedConcepts } = calculateScore();
  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);
  const scorePercent = Math.round((score / questions.length) * 100);

  return (
    <article aria-labelledby="adaptive-quiz-heading" className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            Study Kit Component 4 of 4
          </span>
          <h3
            id="adaptive-quiz-heading"
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5"
          >
            Adaptive Quiz & Knowledge Gap Filler
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Answer the 3 diagnostic questions. SenseiAI pinpoints any conceptual gaps and provides a targeted remedy.
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold block">Score</span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                {score} / {questions.length} ({scorePercent}%)
              </span>
            </div>
            <button
              onClick={handleRetake}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 shadow-xs"
              aria-label="Retake quiz"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        )}
      </div>

      {/* Quiz Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const isCorrect = selectedOption === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              {/* Question Header & Read Aloud */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    Q{qIndex + 1}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </h4>
                    <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Concept: {q.conceptTag}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleReadQuestion(q)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-300 shrink-0"
                  aria-label={`Read Question ${qIndex + 1} aloud`}
                >
                  <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </button>
              </div>

              {/* Options List */}
              <div
                role="radiogroup"
                aria-label={`Options for Question ${qIndex + 1}`}
                className="space-y-2.5"
              >
                {q.options.map((opt, optIndex) => {
                  const isThisSelected = selectedOption === optIndex;
                  const isThisCorrect = optIndex === q.correctIndex;

                  let optionStyles = 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60';

                  if (isSubmitted) {
                    if (isThisCorrect) {
                      optionStyles = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyles = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20';
                    } else {
                      optionStyles = 'opacity-50 border-slate-200 dark:border-slate-800';
                    }
                  } else if (isThisSelected) {
                    optionStyles = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20';
                  }

                  return (
                    <div key={optIndex} className="space-y-1">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={isThisSelected}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, optIndex)}
                        className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between text-sm font-medium transition-all ${optionStyles}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isSubmitted && isThisCorrect && (
                          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-label="Correct answer" />
                        )}
                        {isSubmitted && isThisSelected && !isThisCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" aria-label="Incorrect answer" />
                        )}
                      </button>

                      {/* Option Explanation after submission */}
                      {isSubmitted && q.optionExplanations?.[optIndex] && (isThisSelected || isThisCorrect) && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 px-3 py-1 italic">
                          ↳ {q.optionExplanations[optIndex]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Overall question rationale on submission */}
              {isSubmitted && (
                <div className="mt-3.5 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <strong className="font-bold text-slate-900 dark:text-white">Explanation: </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission & Action Bar */}
      {!isSubmitted ? (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            {Object.keys(selectedAnswers).length} of {questions.length} answered
          </span>
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all"
          >
            <span>Submit Quiz & Diagnose Gaps</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Post-Submission Diagnosis and Remedial Section */
        <section
          aria-label="Quiz Diagnosis and Remedial Lesson"
          className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-violet-50/80 dark:from-slate-900 dark:to-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800/80 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {score === questions.length
                    ? '🎉 Perfect Mastery! 100% Score'
                    : `Diagnosis: ${score} of ${questions.length} Correct`}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {score === questions.length
                    ? 'You demonstrated comprehensive understanding across all tested concepts!'
                    : `We identified ${missedConcepts.length} conceptual gap(s) to patch.`}
                </p>
              </div>
            </div>

            {/* 'Fix My Gaps' Button (Only shown if user has any missed concepts) */}
            {missed.length > 0 && !remedialLesson && (
              <button
                onClick={handleTriggerFixGaps}
                disabled={isGeneratingLesson}
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-rose-600/30 flex items-center gap-2 shrink-0 animate-pulse transition-all"
                aria-label="Generate targeted mini-lesson to fix missed concepts"
              >
                <Brain className="w-4 h-4" />
                <span>
                  {isGeneratingLesson ? 'Diagnosing Gaps with Gemini...' : 'Fix My Gaps (Mini-Lesson)'}
                </span>
              </button>
            )}
          </div>

          {/* List of pinpointed knowledge gaps */}
          {missedConcepts.length > 0 && (
            <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1.5 flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                Pinpointed Conceptual Gap(s):
              </h5>
              <div className="flex flex-wrap gap-2">
                {missedConcepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 text-xs font-bold border border-rose-200 dark:border-rose-800"
                  >
                    • {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Generated Remedial Mini-Lesson */}
          {remedialLesson && (
            <div className="mt-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Targeted Gap-Filler Mini-Lesson
                </span>
                <button
                  onClick={() => onReadAloud(remedialLesson)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                </button>
              </div>

              <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                {remedialLesson}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Now Retake Quiz to Test Score Lift</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </article>
  );
};

