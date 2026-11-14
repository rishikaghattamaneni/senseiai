import React from 'react';
import {
  Mic,
  Brain,
  Volume2,
  AlertCircle,
  Square,
  Pause,
  Play,
  Gauge
} from 'lucide-react';
import { VoiceStatus } from '../types';

interface VoiceStatusBannerProps {
  status: VoiceStatus;
  captionText: string;
  isPaused: boolean;
  speechRate: number;
  onPauseResume: () => void;
  onStopSpeech: () => void;
  onChangeSpeed: (rate: number) => void;
  errorMessage?: string;
  interruptedSnippet?: string;
}

export const VoiceStatusBanner: React.FC<VoiceStatusBannerProps> = ({
  status,
  captionText,
  isPaused,
  speechRate,
  onPauseResume,
  onStopSpeech,
  onChangeSpeed,
  errorMessage,
  interruptedSnippet
}) => {
  const speeds = [0.75, 1.0, 1.25, 1.5];

  // Visual status config
  const getStatusBadge = () => {
    switch (status) {
      case 'listening':
        return (
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold animate-pulse">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <Mic className="w-4 h-4 animate-bounce" aria-hidden="true" />
            <span>Listening to your question... (Speak now)</span>
          </div>
        );
      case 'thinking':
        return (
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
            <Brain className="w-4 h-4 animate-spin text-indigo-500" aria-hidden="true" />
            <span>SenseiAI Thinking (Gemini 3.5 Flash)...</span>
          </div>
        );
      case 'speaking':
        return (
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
            <div className="flex items-center gap-0.5" aria-hidden="true">
              <span className="w-1 h-3 bg-emerald-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"></span>
              <span className="w-1 h-4.5 bg-emerald-600 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.1s]"></span>
              <span className="w-1 h-2.5 bg-emerald-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]"></span>
            </div>
            <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Speaking Explanation {isPaused ? '(Paused)' : 'Aloud'}</span>
          </div>
        );
      case 'interrupted':
        return (
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-500" aria-hidden="true" />
            <span>Speech Interrupted & Doubt Clarification Mode Active</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>Audio/Speech Notice</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Audio Tutor Ready (Press Spacebar to talk or interrupt)</span>
          </div>
        );
    }
  };

  const isAudioActive = status === 'speaking' || isPaused;

  return (
    <section
      aria-label="Live Voice and Audio Captions"
      aria-live="polite"
      className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
        status === 'speaking'
          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
          : status === 'listening'
          ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 ring-2 ring-rose-400/20'
          : status === 'interrupted'
          ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
          : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Top Status & Controls Header */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {getStatusBadge()}
        </div>

        {/* Audio Playback Controls (Visible whenever speech is active or paused) */}
        {isAudioActive && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <Gauge className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span className="text-slate-500 font-medium text-[11px] hidden sm:inline">Speed:</span>
              <div className="flex items-center gap-0.5">
                {speeds.map((s) => (
                  <button
                    key={s}
                    onClick={() => onChangeSpeed(s)}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                      speechRate === s
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    aria-label={`Speech rate ${s}x`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Pause / Resume Button */}
            <button
              onClick={onPauseResume}
              className="p-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-xs"
              aria-label={isPaused ? 'Resume speaking explanation' : 'Pause speech'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" aria-hidden="true" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                  <span>Pause</span>
                </>
              )}
            </button>

            {/* Stop Speech Button */}
            <button
              onClick={onStopSpeech}
              className="p-1.5 px-2 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 flex items-center gap-1"
              title="Stop audio read-aloud (or press Esc key)"
              aria-label="Stop audio read-aloud (Esc shortcut)"
            >
              <Square className="w-3.5 h-3.5 fill-rose-600 text-rose-600" aria-hidden="true" />
              <span>Stop [Esc]</span>
            </button>
          </div>
        )}
      </div>

      {/* Synchronized Live On-Screen Captions Bar */}
      <div className="px-4 py-3">
        {status === 'speaking' || captionText ? (
          <div className="flex items-start gap-3">
            <span
              className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-white shrink-0 mt-0.5"
              aria-hidden="true"
            >
              Caption
            </span>
            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed transition-all">
              "{captionText || 'Reading explanation aloud...'}"
            </p>
          </div>
        ) : status === 'listening' ? (
          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 italic">
            <span className="font-semibold text-rose-600 dark:text-rose-400 not-italic">
              [Microphone Live]:
            </span>
            <span>Speak your question clearly. Click Send or press Spacebar when finished.</span>
          </div>
        ) : status === 'interrupted' && interruptedSnippet ? (
          <div className="text-xs text-amber-800 dark:text-amber-200">
            <strong className="font-bold">Interrupted Sentence:</strong> "{interruptedSnippet}"
          </div>
        ) : errorMessage ? (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {errorMessage}
          </p>
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>
              Real-time synchronized subtitles appear here automatically for hearing-impaired learners.
            </span>
            <span className="text-[11px] font-mono opacity-80 hidden sm:inline">
              Shortcut: Space (Mic) | Esc (Stop Audio)
            </span>
          </div>
        )}
      </div>
    </section>
  );
};


