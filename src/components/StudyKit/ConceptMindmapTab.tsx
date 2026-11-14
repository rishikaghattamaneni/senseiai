import React from 'react';
import {
  GitBranch,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Eye,
  Info
} from 'lucide-react';
import { ConceptMindmap } from '../../types';

interface ConceptMindmapTabProps {
  mindmap: ConceptMindmap;
  onReadAloud: (text: string) => void;
}

export const ConceptMindmapTab: React.FC<ConceptMindmapTabProps> = ({
  mindmap,
  onReadAloud
}) => {
  const steps = mindmap?.steps || [];

  const handleReadDiagramAloud = () => {
    const textToRead = `${mindmap.title}. Diagram overview: ${mindmap.diagramSummary}. Step-by-step breakdown: ${steps
      .map((s) => `Step ${s.stepNumber}: ${s.label}. ${s.detail}`)
      .join('. ')}. Detailed description: ${mindmap.accessibleDescription}`;
    onReadAloud(textToRead);
  };

  const getStepColor = (iconType: string, index: number) => {
    switch (iconType) {
      case 'start':
        return {
          bg: '#e0e7ff',
          stroke: '#4f46e5',
          text: '#3730a3',
          badgeBg: '#4f46e5'
        };
      case 'process':
        return {
          bg: '#e0f2fe',
          stroke: '#0284c7',
          text: '#0369a1',
          badgeBg: '#0284c7'
        };
      case 'decision':
        return {
          bg: '#fef3c7',
          stroke: '#d97706',
          text: '#92400e',
          badgeBg: '#d97706'
        };
      case 'outcome':
        return {
          bg: '#dcfce7',
          stroke: '#16a34a',
          text: '#15803d',
          badgeBg: '#16a34a'
        };
      default:
        return {
          bg: '#f1f5f9',
          stroke: '#64748b',
          text: '#334155',
          badgeBg: '#64748b'
        };
    }
  };

  return (
    <article
      aria-labelledby="mindmap-heading"
      className="space-y-6"
    >
      {/* Tab Header & Audio Description Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <GitBranch className="w-4 h-4" />
            Study Kit Component 3 of 4
          </span>
          <h3
            id="mindmap-heading"
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5"
          >
            {mindmap.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
            {mindmap.diagramSummary}
          </p>
        </div>

        {/* Read Mindmap Aloud Action */}
        <button
          onClick={handleReadDiagramAloud}
          className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
          aria-label="Read complete flowchart and accessible step description aloud"
        >
          <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <span>Read Diagram Aloud</span>
        </button>
      </div>

      {/* Auto-Generated SVG Flowchart Diagram */}
      <figure
        role="region"
        aria-label={`Visual Flowchart: ${mindmap.title}`}
        className="w-full bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-inner overflow-x-auto"
      >
        <div className="min-w-[640px]">
          <svg
            viewBox="0 0 880 200"
            className="w-full h-auto"
            aria-hidden="true"
          >
            <defs>
              <marker
                id="flow-arrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#6366f1" />
              </marker>
            </defs>

            {/* Connecting lines between nodes */}
            {steps.slice(0, steps.length - 1).map((_, i) => {
              const x1 = 100 + i * 220 + 80;
              const x2 = 100 + (i + 1) * 220 - 15;
              const y = 90;
              return (
                <g key={`arrow-${i}`}>
                  <line
                    x1={x1}
                    y1={y}
                    x2={x2}
                    y2={y}
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                    markerEnd="url(#flow-arrow)"
                  />
                  <circle cx={(x1 + x2) / 2} cy={y} r="3" fill="#6366f1" />
                </g>
              );
            })}

            {/* Step Nodes */}
            {steps.map((step, idx) => {
              const x = 15 + idx * 220;
              const y = 25;
              const colors = getStepColor(step.iconType, idx);

              return (
                <g key={`node-${idx}`} className="transition-all hover:opacity-95">
                  {/* Card Background */}
                  <rect
                    x={x}
                    y={y}
                    width="180"
                    height="130"
                    rx="14"
                    fill={colors.bg}
                    stroke={colors.stroke}
                    strokeWidth="2.5"
                  />

                  {/* Step Number Circle Badge */}
                  <circle
                    cx={x + 24}
                    cy={y + 24}
                    r="12"
                    fill={colors.badgeBg}
                  />
                  <text
                    x={x + 24}
                    y={y + 28}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {step.stepNumber}
                  </text>

                  {/* Step Label */}
                  <text
                    x={x + 44}
                    y={y + 28}
                    fill={colors.text}
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {step.label.length > 18 ? step.label.slice(0, 16) + '...' : step.label}
                  </text>

                  {/* Step Detail Snippet (wrapped visually) */}
                  <foreignObject x={x + 10} y={y + 46} width="160" height="74">
                    <div
                      style={{
                        fontSize: '11px',
                        lineHeight: '1.3',
                        color: '#1e293b',
                        fontFamily: 'sans-serif'
                      }}
                    >
                      {step.detail}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
        <figcaption className="text-[11px] text-slate-500 text-center mt-3">
          Interactive concept flowchart representing progressive state changes. Scroll horizontally on smaller screens.
        </figcaption>
      </figure>

      {/* Screen-Reader Friendly Step-by-Step Breakdown */}
      <section
        aria-label="Detailed Accessible Step-by-Step Text Description"
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Detailed Text Narrative (Full Accessibility Mode)
          </h4>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
          {mindmap.accessibleDescription}
        </p>

        <div className="space-y-3 pt-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Sequential Step Breakdown:
          </h5>
          <ol className="space-y-2.5">
            {steps.map((st) => (
              <li
                key={st.stepNumber}
                className="flex items-start gap-3 text-sm text-slate-800 dark:text-slate-200"
              >
                <span className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {st.stepNumber}
                </span>
                <div>
                  <strong className="font-bold text-slate-900 dark:text-white">
                    {st.label}:{' '}
                  </strong>
                  <span>{st.detail}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </article>
  );
};

