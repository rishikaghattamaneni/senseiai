import { PMAnalytics, PMFeedbackItem, TutorMode } from '../types';

const STORAGE_KEY = 'sensei_pm_analytics_v1';

const DEFAULT_ANALYTICS: PMAnalytics = {
  totalSessions: 1,
  topicsExplored: ['Photosynthesis & Plant Solar Power'],
  totalVoiceQuestions: 2,
  interruptionsCount: 1,
  quizTotalTaken: 1,
  quizAverageScorePercent: 78,
  quizScoreLiftPercent: 24, // e.g. from 60% before remedial to 84% after
  satisfactionYes: 4,
  satisfactionSomewhat: 1,
  satisfactionNo: 0,
  feedbackHistory: [
    {
      id: 'initial-demo-1',
      topic: 'Photosynthesis & Plant Solar Power',
      rating: 'yes',
      comment: 'The ELI5 analogy of the leaf bakery and the interactive mindmap made it super easy to understand!',
      timestamp: Date.now() - 3600000,
      mode: 'eli5'
    }
  ]
};

class AnalyticsService {
  private analytics: PMAnalytics;

  constructor() {
    this.analytics = this.load();
  }

  private load(): PMAnalytics {
    if (typeof window === 'undefined') return DEFAULT_ANALYTICS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not load analytics from localStorage', e);
    }
    return DEFAULT_ANALYTICS;
  }

  private save(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.analytics));
    } catch (e) {
      console.warn('Could not save analytics to localStorage', e);
    }
  }

  public getMetrics(): PMAnalytics {
    return { ...this.analytics };
  }

  public trackSession(topic: string): void {
    this.analytics.totalSessions += 1;
    if (!this.analytics.topicsExplored.includes(topic)) {
      this.analytics.topicsExplored.push(topic);
    }
    this.save();
  }

  public trackVoiceQuestion(): void {
    this.analytics.totalVoiceQuestions += 1;
    this.save();
  }

  public trackInterruption(): void {
    this.analytics.interruptionsCount += 1;
    this.save();
  }

  public trackQuiz(score: number, total: number, isRetake: boolean = false): void {
    const percent = Math.round((score / total) * 100);
    const count = this.analytics.quizTotalTaken;
    const currentAvg = this.analytics.quizAverageScorePercent;

    if (!isRetake) {
      this.analytics.quizTotalTaken += 1;
      this.analytics.quizAverageScorePercent = Math.round((currentAvg * count + percent) / (count + 1));
    } else {
      // If retake after gap fixing, calculate lift!
      const lift = Math.max(0, percent - currentAvg);
      this.analytics.quizScoreLiftPercent = Math.round((this.analytics.quizScoreLiftPercent + lift) / 2);
    }
    this.save();
  }

  public recordFeedback(item: Omit<PMFeedbackItem, 'id' | 'timestamp'>): void {
    const feedbackItem: PMFeedbackItem = {
      ...item,
      id: 'fb-' + Date.now(),
      timestamp: Date.now()
    };

    if (item.rating === 'yes') {
      this.analytics.satisfactionYes += 1;
    } else if (item.rating === 'somewhat') {
      this.analytics.satisfactionSomewhat += 1;
    } else {
      this.analytics.satisfactionNo += 1;
    }

    this.analytics.feedbackHistory.unshift(feedbackItem);
    this.save();
  }

  public resetMetrics(): void {
    this.analytics = {
      totalSessions: 0,
      topicsExplored: [],
      totalVoiceQuestions: 0,
      interruptionsCount: 0,
      quizTotalTaken: 0,
      quizAverageScorePercent: 0,
      quizScoreLiftPercent: 0,
      satisfactionYes: 0,
      satisfactionSomewhat: 0,
      satisfactionNo: 0,
      feedbackHistory: []
    };
    this.save();
  }
}

export const analyticsService = new AnalyticsService();
