export type TutorMode = 'socratic' | 'eli5' | 'exam';

export type ContrastTheme = 'normal' | 'high-contrast-black' | 'yellow-black' | 'cream-dark';

export type TextSize = 'normal' | 'large' | 'extra-large';

export interface AccessibilitySettings {
  contrastTheme: ContrastTheme;
  textSize: TextSize;
  dyslexicFont: boolean;
  autoReadAloud: boolean;
  speechRate: number; // 0.75, 1.0, 1.25, 1.5
  speechPitch: number;
  soundEffects: boolean;
  captionsEnabled: boolean;
}

export type VoiceStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'interrupted' | 'error';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isInterruption?: boolean;
  interruptedSnippet?: string;
  mode?: TutorMode;
}

export interface QuickNotes {
  title: string;
  summary: string;
  keyPoints: string[];
  formulasOrRules: string[];
  commonMisconceptions: string[];
  proTip: string;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
  memoryHook: string;
}

export interface MindmapStep {
  stepNumber: number;
  label: string;
  detail: string;
  iconType: 'start' | 'process' | 'decision' | 'outcome';
}

export interface ConceptMindmap {
  title: string;
  diagramSummary: string;
  steps: MindmapStep[];
  accessibleDescription: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  conceptTag: string;
  explanation: string;
  optionExplanations: string[];
}

export interface StudyKit {
  topic: string;
  mode: TutorMode;
  spokenExplanation: string;
  quickNotes: QuickNotes;
  flashcards: Flashcard[];
  conceptMindmap: ConceptMindmap;
  adaptiveQuiz: QuizQuestion[];
}

export interface QuizSubmission {
  score: number;
  total: number;
  userAnswers: Record<number, number>;
  missedQuestionIds: number[];
  missedConcepts: string[];
  timestamp: number;
  remedialLesson?: string;
  isRetake?: boolean;
}

export interface PMFeedbackItem {
  id: string;
  topic: string;
  rating: 'yes' | 'somewhat' | 'no';
  comment: string;
  timestamp: number;
  mode: TutorMode;
}

export interface PMAnalytics {
  totalSessions: number;
  topicsExplored: string[];
  totalVoiceQuestions: number;
  interruptionsCount: number;
  quizTotalTaken: number;
  quizAverageScorePercent: number;
  quizScoreLiftPercent: number; // lift from remedial mini-lessons
  satisfactionYes: number;
  satisfactionSomewhat: number;
  satisfactionNo: number;
  feedbackHistory: PMFeedbackItem[];
}
