// Web Speech API and Web Audio synthesizer service

// Polyfill interfaces for browser SpeechRecognition
interface IWindowWithSpeech extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

class SpeechService {
  private recognition: any = null;
  private isListening = false;
  private audioContext: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;
    const win = window as IWindowWithSpeech;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      } catch (err) {
        console.warn('Could not initialize SpeechRecognition:', err);
      }
    }
  }

  public isRecognitionAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as IWindowWithSpeech;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public isSynthesisAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public startListening(
    onInterim: (text: string) => void,
    onFinal: (text: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) {
      onError('Speech Recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    let finalTranscript = '';

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interim += transcript;
        }
      }
      if (interim) {
        onInterim(interim);
      }
      if (finalTranscript) {
        onFinal(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      let errorMsg = 'Voice recognition error occurred.';
      if (event.error === 'not-allowed') {
        errorMsg = 'Microphone permission denied. Please allow microphone access in browser settings.';
      } else if (event.error === 'no-speech') {
        errorMsg = 'No speech detected. Please try speaking again.';
      } else if (event.error === 'network') {
        errorMsg = 'Network error while recognizing speech.';
      }
      onError(errorMsg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e: any) {
      onError(e?.message || 'Could not start microphone.');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
      this.isListening = false;
    }
  }

  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onBoundary?: (charIndex: number, textSnippet: string) => void;
      onError?: (err: any) => void;
    }
  ): void {
    if (!this.isSynthesisAvailable()) {
      options.onError?.('Speech synthesis not available in this browser.');
      return;
    }

    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    // Clean markdown stars/brackets from text for smoother speech
    const cleanText = text
      .replace(/[*#_`~[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('English')) && v.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onboundary = (event) => {
      // Find approximate current sentence or phrase
      if (options.onBoundary && event.charIndex !== undefined) {
        const slice = cleanText.substring(event.charIndex, event.charIndex + 60);
        options.onBoundary(event.charIndex, slice);
      }
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (err) => {
      this.currentUtterance = null;
      // 'interrupted' or 'canceled' is intentional when user clicks interrupt
      if (err.error !== 'interrupted' && err.error !== 'canceled') {
        options.onError?.(err);
      }
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public cancelSpeech(): void {
    if (this.isSynthesisAvailable()) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public pauseSpeech(): void {
    if (this.isSynthesisAvailable() && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  public resumeSpeech(): void {
    if (this.isSynthesisAvailable() && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  public isSpeaking(): boolean {
    return this.isSynthesisAvailable() && window.speechSynthesis.speaking && !window.speechSynthesis.paused;
  }

  public isPaused(): boolean {
    return this.isSynthesisAvailable() && window.speechSynthesis.paused;
  }

  // Synthesized audio chimes via Web Audio API (Accessible sound cues)
  public playChime(type: 'start' | 'stop' | 'success' | 'interrupt' | 'click'): void {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }

      const ctx = this.audioContext;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'start') {
        // Ascending double beep: Ready to listen
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'stop') {
        // Descending beep: Done listening
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'success') {
        // Happy major chord chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'interrupt') {
        // Crisp interruption ping
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(450, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {
      // Audio chimes are non-critical enhancements
      console.debug('Chime error:', e);
    }
  }
}

export const speechService = new SpeechService();

