import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
  CornerDownLeft,
  Flame,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, TutorMode, VoiceStatus } from '../types';

interface ChatAndClarifyProps {
  messages: ChatMessage[];
  currentTopic: string;
  voiceStatus: VoiceStatus;
  isListening: boolean;
  onSendQuestion: (text: string, isInterrupt?: boolean) => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onInterruptAndAsk: () => void;
  onSpeakMessage: (text: string) => void;
  onSelectSampleTopic: (topicKey: string) => void;
  isLoading: boolean;
  activeMode: TutorMode;
}

export const ChatAndClarify: React.FC<ChatAndClarifyProps> = ({
  messages,
  currentTopic,
  voiceStatus,
  isListening,
  onSendQuestion,
  onStartListening,
  onStopListening,
  onInterruptAndAsk,
  onSpeakMessage,
  onSelectSampleTopic,
  isLoading,
  activeMode
}) => {
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendQuestion(inputText.trim(), voiceStatus === 'speaking' || voiceStatus === 'interrupted');
    setInputText('');
  };

  const isSpeaking = voiceStatus === 'speaking';

  return (
    <section
      aria-label="Tutor Conversation and Voice Input"
      className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      {/* Conversation Thread Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              Interactive Dialogue & Doubt Clearing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Topic: <strong className="text-slate-700 dark:text-slate-200">{currentTopic}</strong>
            </p>
          </div>
        </div>

        {/* Live 'Interrupt & Clarify' Button - Super prominent when Sensei is speaking aloud */}
        {isSpeaking ? (
          <button
            onClick={onInterruptAndAsk}
            className="px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 flex items-center gap-2 animate-pulse transition-all transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-rose-400"
            title="Immediately pause speech and ask a question about what was just said"
            aria-label="Interrupt speech and ask a doubt right now"
          >
            <Zap className="w-4 h-4 fill-white text-white animate-bounce" aria-hidden="true" />
            <span>Interrupt & Ask Doubt [Space]</span>
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              Space
            </kbd>
            <span>Mic Toggle</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Topics Pill Bar */}
      <div className="px-4 py-2 bg-slate-100/60 dark:bg-slate-800/30 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Try Demo:
        </span>
        <button
          onClick={() => onSelectSampleTopic('photosynthesis')}
          className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap transition-colors"
        >
          🌿 Photosynthesis (ELI5)
        </button>
        <button
          onClick={() => onSelectSampleTopic('newton-laws')}
          className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap transition-colors"
        >
          🚀 Newton's 3 Laws (Socratic)
        </button>
        <button
          onClick={() => onSelectSampleTopic('internet-dns')}
          className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap transition-colors"
        >
          🌐 Internet & DNS (Exam Sprint)
        </button>
      </div>

      {/* Message History Container */}
      <div
        ref={chatScrollRef}
        role="log"
        aria-label="Conversation messages"
        className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[380px] sm:max-h-[440px]"
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <article
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              {/* Speaker label & Interruption metadata */}
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <span>{isUser ? 'You (Student)' : 'SenseiAI'}</span>
                {msg.isInterruption && (
                  <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold flex items-center gap-1 border border-rose-200 dark:border-rose-800">
                    <Zap className="w-3 h-3" /> Voice Interruption
                  </span>
                )}
              </div>

              {/* Speech bubble */}
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 text-sm sm:text-base leading-relaxed relative group ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200/80 dark:border-slate-700/80 shadow-xs'
                }`}
              >
                {/* If user interrupted at a specific snippet */}
                {msg.interruptedSnippet && (
                  <div className="mb-2 p-2 rounded-lg bg-black/10 text-xs italic border-l-2 border-amber-400">
                    Interrupted sentence: "{msg.interruptedSnippet}"
                  </div>
                )}

                <p className="whitespace-pre-line">{msg.content}</p>

                {/* Read aloud button for Sensei's answers */}
                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onSpeakMessage(msg.content)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
                      aria-label="Read this answer aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Read Aloud</span>
                    </button>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </article>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-sm">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
            <span>SenseiAI is tailoring explanation in {activeMode.toUpperCase()} mode...</span>
          </div>
        )}
      </div>

      {/* Bottom Voice Input & Text Box Controls */}
      <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Prominent Voice Input Mic Button */}
          <button
            type="button"
            onClick={isListening ? onStopListening : onStartListening}
            className={`p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-400/30'
                : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
            }`}
            title={isListening ? 'Click to stop listening' : 'Ask Doubt via Voice (Mic)'}
            aria-label={isListening ? 'Stop microphone' : 'Ask Doubt via Microphone'}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 text-white" aria-hidden="true" />
                <span className="hidden sm:inline">Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <span className="hidden sm:inline">Ask Doubt (Mic)</span>
              </>
            )}
          </button>

          {/* Accessible Text Input Box */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isSpeaking
                  ? 'Sensei is speaking... Type or press Spacebar to interrupt!'
                  : 'Ask a doubt or enter a new topic (e.g. "Quantum Superposition", "Mitochondria")...'
              }
              className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
              aria-label="Ask a question or enter a topic"
              disabled={isLoading}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm transition-colors shrink-0"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 text-center sm:text-left">
          💡 Spacebar toggles voice microphone outside text box. Pressing Spacebar while Sensei speaks triggers an instant interruption.
        </p>
      </div>
    </section>
  );
};


