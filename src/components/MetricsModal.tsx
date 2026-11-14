import React from 'react';
import {
  X,
  BarChart3,
  ThumbsUp,
  TrendingUp,
  Brain,
  Zap,
  Mic,
  Award,
  Download,
  Trash2
} from 'lucide-react';
import { PMAnalytics } from '../types';

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: PMAnalytics;
  onReset: () => void;
}

export const MetricsModal: React.FC<MetricsModalProps> = ({
  isOpen,
  onClose,
  metrics,
  onReset
}) => {
  if (!isOpen) return null;

  const totalFeedback =
    metrics.satisfactionYes + metrics.satisfactionSomewhat + metrics.satisfactionNo;

  const satisfactionRate =
    totalFeedback > 0
      ? Math.round((metrics.satisfactionYes / totalFeedback) * 100)
      : 100;

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(metrics, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sensei-ai-impact-metrics-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="metrics-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="metrics-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                PM Impact Metrics & User Satisfaction Tracker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live pedagogical performance telemetry for SenseiAI testing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close metrics modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80">
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
                Satisfaction
              </span>
              <span className="text-2xl font-black text-indigo-900 dark:text-white block mt-1">
                {satisfactionRate}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {metrics.satisfactionYes} Yes / {totalFeedback} Total
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
                Quiz Score Lift
              </span>
              <span className="text-2xl font-black text-emerald-900 dark:text-white block mt-1 flex items-center gap-1">
                +{metrics.quizScoreLiftPercent}%
                <TrendingUp className="w-4 h-4 text-emerald-600 inline" />
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Post 'Fix My Gaps'
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
                Interrupted Doubts
              </span>
              <span className="text-2xl font-black text-amber-900 dark:text-white block mt-1 flex items-center gap-1">
                {metrics.interruptionsCount}
                <Zap className="w-4 h-4 text-amber-600 inline" />
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Live speech clarifications
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80">
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
                Topics Mastered
              </span>
              <span className="text-2xl font-black text-purple-900 dark:text-white block mt-1">
                {metrics.topicsExplored.length}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {metrics.totalSessions} Study Sessions
              </span>
            </div>
          </div>

          {/* Topics Explored Pill List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Topics Explored in this Profile:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {metrics.topicsExplored.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  ✓ {t}
                </span>
              ))}
            </div>
          </div>

          {/* Feedback History Log */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Learner Feedback & Understanding Ratings ({metrics.feedbackHistory.length}):
            </h4>
            <div className="space-y-2 max-h-44 overflow-y-auto">
              {metrics.feedbackHistory.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No feedback entries recorded yet.</p>
              ) : (
                metrics.feedbackHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.topic} ({item.mode.toUpperCase()})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          item.rating === 'yes'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : item.rating === 'somewhat'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        Helpful: {item.rating}
                      </span>
                    </div>
                    {item.comment && (
                      <p className="text-slate-600 dark:text-slate-300 italic">"{item.comment}"</p>
                    )}
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer with Export & Reset Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Profile Telemetry</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Telemetry JSON</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
