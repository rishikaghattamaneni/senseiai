import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText,
  Layers,
  GitBranch,
  Target,
  Sparkles,
  RefreshCw,
  Volume2
} from 'lucide-react';
import {
  AccessibilitySettings,
  ChatMessage,
  PMAnalytics,
  QuizSubmission,
  StudyKit,
  TutorMode,
  VoiceStatus,
  QuizQuestion
} from './types';
import { SAMPLE_STUDY_KITS } from './data/sampleTopics';
import { speechService } from './services/speechService';
import { geminiService } from './services/geminiService';
import { analyticsService } from './services/analyticsService';

import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { VoiceStatusBanner } from './components/VoiceStatusBanner';
import { ChatAndClarify } from './components/ChatAndClarify';
import { QuickNotesTab } from './components/StudyKit/QuickNotesTab';
import { FlashcardsTab } from './components/StudyKit/FlashcardsTab';
import { ConceptMindmapTab } from './components/StudyKit/ConceptMindmapTab';
import { AdaptiveQuizTab } from './components/StudyKit/AdaptiveQuizTab';
import { SessionFeedback } from './components/SessionFeedback';
import { MetricsModal } from './components/MetricsModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';

type TabType = 'notes' | 'flashcards' | 'mindmap' | 'quiz';

export default function App() {
  // Accessibility Settings state
  const [settings, setSettings] = useState<AccessibilitySettings>({
    contrastTheme: 'normal',
    textSize: 'normal',
    dyslexicFont: false,
    autoReadAloud: false,
    speechRate: 1.0,
    speechPitch: 1.0,
    soundEffects: true,
    captionsEnabled: true
  });

  // Core Learning State
  const [activeTab, setActiveTab] = useState<TabType>('notes');
  const [currentMode, setCurrentMode] = useState<TutorMode>('eli5');
  const [currentTopic, setCurrentTopic] = useState<string>('Photosynthesis & Plant Solar Power');
  const [studyKit, setStudyKit] = useState<StudyKit>(SAMPLE_STUDY_KITS['photosynthesis']);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Conversation history
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      role: 'assistant',
      content: SAMPLE_STUDY_KITS['photosynthesis'].spokenExplanation,
      timestamp: Date.now() - 60000,
      mode: 'eli5'
    }
  ]);

  // Voice & Audio Telemetry state
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [captionText, setCaptionText] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interruptedSnippet, setInterruptedSnippet] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Modals state
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [metrics, setMetrics] = useState<PMAnalytics>(analyticsService.getMetrics());

  // Ref tracking currently spoken sentence for interruptions
  const currentSpokenSliceRef = useRef<string>('');

  // Update theme & text scale on root DOM
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-high-contrast-black', 'theme-yellow-black', 'theme-cream-dark');
    if (settings.contrastTheme === 'high-contrast-black') {
      root.classList.add('theme-high-contrast-black');
    } else if (settings.contrastTheme === 'yellow-black') {
      root.classList.add('theme-yellow-black');
    } else if (settings.contrastTheme === 'cream-dark') {
      root.classList.add('theme-cream-dark');
    }

    root.classList.remove('text-scale-large', 'text-scale-extra-large');
    if (settings.textSize === 'large') {
      root.classList.add('text-scale-large');
    } else if (settings.textSize === 'extra-large') {
      root.classList.add('text-scale-extra-large');
    }
  }, [settings.contrastTheme, settings.textSize]);

  // Read aloud helper with boundary events
  const speakText = useCallback(
    (text: string) => {
      if (!text) return;
      speechService.cancelSpeech();
      setIsPaused(false);
      setCaptionText('');
      currentSpokenSliceRef.current = text.slice(0, 80);

      speechService.speak(text, {
        rate: settings.speechRate,
        pitch: settings.speechPitch,
        onStart: () => {
          setVoiceStatus('speaking');
          setCaptionText(text.slice(0, 100) + '...');
        },
        onBoundary: (charIndex, textSnippet) => {
          setCaptionText(textSnippet);
          currentSpokenSliceRef.current = textSnippet;
        },
        onEnd: () => {
          setVoiceStatus('idle');
          setCaptionText('');
        },
        onError: (err) => {
          console.warn('Speech error:', err);
          setVoiceStatus('idle');
        }
      });
    },
    [settings.speechRate, settings.speechPitch]
  );

  // Stop all audio immediately
  const handleStopSpeech = useCallback(() => {
    speechService.cancelSpeech();
    setIsPaused(false);
    setVoiceStatus('idle');
    setCaptionText('');
  }, []);

  // Pause / Resume speech
  const handlePauseResume = useCallback(() => {
    if (speechService.isPaused()) {
      speechService.resumeSpeech();
      setIsPaused(false);
      setVoiceStatus('speaking');
    } else if (speechService.isSpeaking()) {
      speechService.pauseSpeech();
      setIsPaused(true);
    }
  }, []);

  // Stop listening handler
  const handleStopListening = useCallback(() => {
    speechService.stopListening();
    setIsListening(false);
    if (settings.soundEffects) {
      speechService.playChime('stop');
    }
    setVoiceStatus('idle');
  }, [settings.soundEffects]);

  // Send Question / Clarification / New Topic
  const handleSendQuestion = useCallback(
    async (doubtText: string, isInterrupt: boolean = false) => {
      if (!doubtText.trim()) return;

      const userMsg: ChatMessage = {
        id: 'msg-' + Date.now(),
        role: 'user',
        content: doubtText,
        timestamp: Date.now(),
        isInterruption: isInterrupt,
        interruptedSnippet: isInterrupt ? interruptedSnippet : undefined
      };

      setChatMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setVoiceStatus('thinking');

      try {
        if (isInterrupt && interruptedSnippet) {
          // Interrupt & Clarify flow: sends previous context + interrupted point to Gemini
          analyticsService.trackInterruption();
          const historySummary = chatMessages
            .slice(-4)
            .map((m) => `${m.role}: ${m.content}`)
            .join('\n');

          const clarification = await geminiService.clarifyInterruption(
            doubtText,
            currentTopic,
            interruptedSnippet,
            historySummary,
            currentMode
          );

          const assistantMsg: ChatMessage = {
            id: 'asst-' + Date.now(),
            role: 'assistant',
            content: clarification,
            timestamp: Date.now(),
            mode: currentMode
          };

          setChatMessages((prev) => [...prev, assistantMsg]);
          setIsLoading(false);
          setInterruptedSnippet('');
          setMetrics(analyticsService.getMetrics());

          // Automatically speak clarification aloud for continuity
          speakText(clarification);
        } else {
          // Check if this looks like a new topic request or general question
          const isNewTopic =
            doubtText.toLowerCase().startsWith('teach me') ||
            doubtText.toLowerCase().startsWith('explain') ||
            doubtText.length < 50;

          if (isNewTopic) {
            const cleanTopic = doubtText.replace(/^(teach me|explain|what is)\s*/i, '').trim();
            const kit = await geminiService.generateStudyKit(cleanTopic || doubtText, currentMode);
            setStudyKit(kit);
            setCurrentTopic(kit.topic);
            analyticsService.trackSession(kit.topic);

            const newMsg: ChatMessage = {
              id: 'asst-' + Date.now(),
              role: 'assistant',
              content: kit.spokenExplanation,
              timestamp: Date.now(),
              mode: currentMode
            };

            setChatMessages((prev) => [...prev, newMsg]);
            setIsLoading(false);
            setMetrics(analyticsService.getMetrics());

            if (settings.autoReadAloud) {
              speakText(kit.spokenExplanation);
            } else {
              setVoiceStatus('idle');
            }
          } else {
            // Contextual Q&A follow-up
            const history = chatMessages.map((m) => `${m.role}: ${m.content}`).join('\n');
            const answer = await geminiService.clarifyInterruption(
              doubtText,
              currentTopic,
              studyKit.quickNotes.summary,
              history,
              currentMode
            );

            const asstMsg: ChatMessage = {
              id: 'asst-' + Date.now(),
              role: 'assistant',
              content: answer,
              timestamp: Date.now(),
              mode: currentMode
            };

            setChatMessages((prev) => [...prev, asstMsg]);
            setIsLoading(false);
            speakText(answer);
          }
        }
      } catch (err: any) {
        console.error('Error handling question:', err);
        setErrorMessage(err?.message || 'Error communicating with Gemini tutor.');
        setIsLoading(false);
        setVoiceStatus('idle');
      }
    },
    [interruptedSnippet, chatMessages, currentTopic, currentMode, studyKit, settings.autoReadAloud, speakText]
  );

  // Start listening handler
  const handleStartListening = useCallback(() => {
    // If speaking, interrupt!
    if (speechService.isSpeaking()) {
      const activeSnippet = currentSpokenSliceRef.current || 'Sensei explanation';
      setInterruptedSnippet(activeSnippet);
      speechService.cancelSpeech();
      setVoiceStatus('interrupted');
    }

    if (settings.soundEffects) {
      speechService.playChime('start');
    }

    setIsListening(true);
    setVoiceStatus('listening');
    setErrorMessage('');

    speechService.startListening(
      (interim) => {
        setCaptionText(`Listening: "${interim}"`);
      },
      (finalText) => {
        setIsListening(false);
        analyticsService.trackVoiceQuestion();
        if (settings.soundEffects) {
          speechService.playChime('stop');
        }
        handleSendQuestion(finalText, !!interruptedSnippet);
      },
      (err) => {
        setErrorMessage(err);
        setIsListening(false);
        setVoiceStatus('error');
      },
      () => {
        setIsListening(false);
      }
    );
  }, [settings.soundEffects, interruptedSnippet, handleSendQuestion]);

  // 'Interrupt & Clarify' Live Voice Flow button handler
  const handleInterruptAndAsk = useCallback(() => {
    if (settings.soundEffects) {
      speechService.playChime('interrupt');
    }
    const currentSnippet = currentSpokenSliceRef.current || 'Explanation in progress';
    setInterruptedSnippet(currentSnippet);
    speechService.cancelSpeech();
    setVoiceStatus('interrupted');

    // Trigger microphone listening immediately
    setTimeout(() => {
      handleStartListening();
    }, 150);
  }, [settings.soundEffects, handleStartListening]);

  // Universal Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // SAFEGUARD: Never intercept keys if typing inside input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isInput) {
        // Allow typing spaces and keys normally without interception!
        return;
      }

      // Esc: Stop audio playback immediately
      if (e.key === 'Escape') {
        e.preventDefault();
        handleStopSpeech();
        if (isListening) {
          handleStopListening();
        }
        return;
      }

      // Spacebar: Toggle mic or interrupt ongoing speech
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (voiceStatus === 'speaking') {
          handleInterruptAndAsk();
        } else if (isListening) {
          handleStopListening();
        } else {
          handleStartListening();
        }
        return;
      }

      // Number keys 1-4: Switch Study Kit Tabs
      if (e.key === '1') {
        e.preventDefault();
        setActiveTab('notes');
      } else if (e.key === '2') {
        e.preventDefault();
        setActiveTab('flashcards');
      } else if (e.key === '3') {
        e.preventDefault();
        setActiveTab('mindmap');
      } else if (e.key === '4') {
        e.preventDefault();
        setActiveTab('quiz');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [voiceStatus, isListening, handleStopSpeech, handleStopListening, handleInterruptAndAsk]);

  // Handle switching learning style mode
  const handleSelectMode = async (mode: TutorMode) => {
    if (mode === currentMode) return;
    setCurrentMode(mode);
    setIsLoading(true);

    try {
      const updatedKit = await geminiService.generateStudyKit(currentTopic, mode);
      setStudyKit(updatedKit);

      const modeChangeMsg: ChatMessage = {
        id: 'asst-' + Date.now(),
        role: 'assistant',
        content: `Switched to ${mode.toUpperCase()} teaching mode:\n\n${updatedKit.spokenExplanation}`,
        timestamp: Date.now(),
        mode
      };

      setChatMessages((prev) => [...prev, modeChangeMsg]);
      setIsLoading(false);

      if (settings.autoReadAloud) {
        speakText(updatedKit.spokenExplanation);
      }
    } catch (e: any) {
      console.warn('Mode change generation failed, applying local adaptation:', e);
      setStudyKit((prev) => ({ ...prev, mode }));
      setIsLoading(false);
    }
  };

  // Pre-loaded sample topics selector
  const handleSelectSampleTopic = (key: string) => {
    const kit = SAMPLE_STUDY_KITS[key];
    if (kit) {
      speechService.cancelSpeech();
      setCurrentTopic(kit.topic);
      setCurrentMode(kit.mode);
      setStudyKit(kit);
      analyticsService.trackSession(kit.topic);

      const msg: ChatMessage = {
        id: 'sample-' + Date.now(),
        role: 'assistant',
        content: kit.spokenExplanation,
        timestamp: Date.now(),
        mode: kit.mode
      };

      setChatMessages((prev) => [...prev, msg]);
      setMetrics(analyticsService.getMetrics());

      if (settings.autoReadAloud) {
        speakText(kit.spokenExplanation);
      }
    }
  };

  // Adaptive Quiz: Submit and Gap Fixing
  const handleSubmitQuiz = (submission: QuizSubmission) => {
    analyticsService.trackQuiz(submission.score, submission.total);
    setMetrics(analyticsService.getMetrics());
  };

  const handleFixGaps = async (missedQuestions: QuizQuestion[], missedConcepts: string[]): Promise<string> => {
    return await geminiService.generateRemedialMiniLesson(currentTopic, missedQuestions, missedConcepts);
  };

  // Feedback Submission
  const handleFeedbackSubmit = (rating: 'yes' | 'somewhat' | 'no', comment: string) => {
    analyticsService.recordFeedback({
      topic: currentTopic,
      rating,
      comment,
      mode: currentMode
    });
    setMetrics(analyticsService.getMetrics());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header with Top Accessibility Bar */}
      <Header
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
        onOpenMetrics={() => setIsMetricsOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        hasApiKey={geminiService.hasApiKey()}
      />

      {/* Main Accessible Learning Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top: Learning Style & Pace Selector (VARK & Socratic Modes) */}
        <ModeSelector
          currentMode={currentMode}
          onSelectMode={handleSelectMode}
          disabled={isLoading}
        />

        {/* Live Visual Status Indicator & Real-Time Synchronized Captions */}
        <VoiceStatusBanner
          status={voiceStatus}
          captionText={captionText}
          isPaused={isPaused}
          speechRate={settings.speechRate}
          onPauseResume={handlePauseResume}
          onStopSpeech={handleStopSpeech}
          onChangeSpeed={(rate) => {
            setSettings((prev) => ({ ...prev, speechRate: rate }));
            if (speechService.isSpeaking()) {
              speakText(captionText || studyKit.spokenExplanation);
            }
          }}
          errorMessage={errorMessage}
          interruptedSnippet={interruptedSnippet}
        />

        {/* Core Layout: Left Chat & Doubt Interruption + Right Multi-Sensory Study Kit Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Dialogue & Hands-free Mic Input (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <ChatAndClarify
              messages={chatMessages}
              currentTopic={currentTopic}
              voiceStatus={voiceStatus}
              isListening={isListening}
              onSendQuestion={handleSendQuestion}
              onStartListening={handleStartListening}
              onStopListening={handleStopListening}
              onInterruptAndAsk={handleInterruptAndAsk}
              onSpeakMessage={speakText}
              onSelectSampleTopic={handleSelectSampleTopic}
              isLoading={isLoading}
              activeMode={currentMode}
            />
          </div>

          {/* Right Column: Multi-Sensory Study Kit & Adaptive Quiz Tabs (7 cols) */}
          <section
            aria-label="Multi-Sensory Study Kit"
            className="lg:col-span-7 w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col"
          >
            {/* 4 Interactive Study Kit Tabs Header */}
            <div
              role="tablist"
              aria-label="Study Kit Modes"
              className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 p-2 gap-1.5 overflow-x-auto"
            >
              {/* Tab 1: Quick Notes */}
              <button
                role="tab"
                id="tab-notes"
                aria-selected={activeTab === 'notes'}
                aria-controls="panel-notes"
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  activeTab === 'notes'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-4 h-4" aria-hidden="true" />
                <span>1. Quick Notes</span>
              </button>

              {/* Tab 2: Flashcards */}
              <button
                role="tab"
                id="tab-flashcards"
                aria-selected={activeTab === 'flashcards'}
                aria-controls="panel-flashcards"
                onClick={() => setActiveTab('flashcards')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  activeTab === 'flashcards'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>2. Flashcards</span>
              </button>

              {/* Tab 3: Concept Mindmap */}
              <button
                role="tab"
                id="tab-mindmap"
                aria-selected={activeTab === 'mindmap'}
                aria-controls="panel-mindmap"
                onClick={() => setActiveTab('mindmap')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  activeTab === 'mindmap'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <GitBranch className="w-4 h-4" aria-hidden="true" />
                <span>3. Concept Mindmap</span>
              </button>

              {/* Tab 4: Adaptive Quiz */}
              <button
                role="tab"
                id="tab-quiz"
                aria-selected={activeTab === 'quiz'}
                aria-controls="panel-quiz"
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Target className="w-4 h-4" aria-hidden="true" />
                <span>4. Adaptive Quiz</span>
              </button>
            </div>

            {/* Tab Panel Content with Accessible Roles */}
            <div className="p-5 sm:p-6 flex-1">
              <div
                role="tabpanel"
                id="panel-notes"
                aria-labelledby="tab-notes"
                hidden={activeTab !== 'notes'}
              >
                {activeTab === 'notes' && (
                  <QuickNotesTab
                    notes={studyKit.quickNotes}
                    onReadAloud={speakText}
                  />
                )}
              </div>

              <div
                role="tabpanel"
                id="panel-flashcards"
                aria-labelledby="tab-flashcards"
                hidden={activeTab !== 'flashcards'}
              >
                {activeTab === 'flashcards' && (
                  <FlashcardsTab
                    cards={studyKit.flashcards}
                    onReadAloud={speakText}
                  />
                )}
              </div>

              <div
                role="tabpanel"
                id="panel-mindmap"
                aria-labelledby="tab-mindmap"
                hidden={activeTab !== 'mindmap'}
              >
                {activeTab === 'mindmap' && (
                  <ConceptMindmapTab
                    mindmap={studyKit.conceptMindmap}
                    onReadAloud={speakText}
                  />
                )}
              </div>

              <div
                role="tabpanel"
                id="panel-quiz"
                aria-labelledby="tab-quiz"
                hidden={activeTab !== 'quiz'}
              >
                {activeTab === 'quiz' && (
                  <AdaptiveQuizTab
                    questions={studyKit.adaptiveQuiz}
                    topic={studyKit.topic}
                    onReadAloud={speakText}
                    onSubmitQuiz={handleSubmitQuiz}
                    onFixGaps={handleFixGaps}
                  />
                )}
              </div>
            </div>
          </section>
        </div>

        {/* End-of-Session Rating & Feedback Tracker */}
        <SessionFeedback
          topic={currentTopic}
          currentMode={currentMode}
          onSubmitFeedback={handleFeedbackSubmit}
        />
      </main>

      {/* Accessible Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          SenseiAI • Inclusive Multi-Sensory AI Personal Tutor • Built with Next/React & Google Gemini 2.5 Flash • Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Space</kbd> to talk, <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Esc</kbd> to stop audio.
        </p>
      </footer>

      {/* Modals */}
      <MetricsModal
        isOpen={isMetricsOpen}
        onClose={() => setIsMetricsOpen(false)}
        metrics={metrics}
        onReset={() => {
          analyticsService.resetMetrics();
          setMetrics(analyticsService.getMetrics());
        }}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        currentApiKey={geminiService.hasApiKey() ? 'API_KEY_CONFIGURED' : ''}
        onSaveApiKey={(key) => geminiService.setApiKey(key)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
