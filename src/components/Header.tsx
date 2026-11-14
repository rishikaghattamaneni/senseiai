import React from 'react';
import {
  Accessibility,
  Eye,
  Type,
  Volume2,
  VolumeX,
  BarChart3,
  KeyRound,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { AccessibilitySettings, ContrastTheme, TextSize } from '../types';

interface HeaderProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  onOpenMetrics: () => void;
  onOpenApiKey: () => void;
  onOpenShortcuts: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenMetrics,
  onOpenApiKey,
  onOpenShortcuts,
  hasApiKey
}) => {
  const contrastCycles: ContrastTheme[] = [
    'normal',
    'high-contrast-black',
    'yellow-black',
    'cream-dark'
  ];

  const cycleContrast = () => {
    const currentIndex = contrastCycles.indexOf(settings.contrastTheme);
    const nextTheme = contrastCycles[(currentIndex + 1) % contrastCycles.length];
    onUpdateSettings({ contrastTheme: nextTheme });
  };

  const cycleTextSize = () => {
    const sizes: TextSize[] = ['normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(settings.textSize);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    onUpdateSettings({ textSize: nextSize });
  };

  const getContrastLabel = () => {
    switch (settings.contrastTheme) {
      case 'high-contrast-black':
        return 'Contrast: High (B&W)';
      case 'yellow-black':
        return 'Contrast: Yellow/Black';
      case 'cream-dark':
        return 'Contrast: Sepia/Dark';
      default:
        return 'Contrast: Default';
    }
  };

  const getTextSizeLabel = () => {
    switch (settings.textSize) {
      case 'large':
        return 'Text: Large (125%)';
      case 'extra-large':
        return 'Text: X-Large (150%)';
      default:
        return 'Text: Normal (100%)';
    }
  };

  return (
    <header className="border-b transition-colors duration-150 py-3 px-4 sm:px-6 sticky top-0 z-30 shadow-xs backdrop-blur-md">
      {/* Skip to Main Content Link for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-md focus:font-bold focus:shadow-lg focus:outline-none"
      >
        Skip to main learning content
      </a>

      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Mission Tag */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20"
            aria-hidden="true"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5">
                Sensei<span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700">
                Gemini 3.5 Flash
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Inclusive, Multi-Sensory AI Personal Tutor for All Learners
            </p>
          </div>
        </div>

        {/* Accessibility & Action Bar */}
        <nav aria-label="Accessibility and controls" className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Contrast Mode Toggle */}
          <button
            onClick={cycleContrast}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            title="Cycle High-Contrast Themes for low-vision support"
            aria-label={getContrastLabel()}
          >
            <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span className="hidden md:inline">{getContrastLabel()}</span>
          </button>

          {/* Text Size Scale Toggle */}
          <button
            onClick={cycleTextSize}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            title="Toggle Text Sizing (Normal, Large, Extra Large)"
            aria-label={getTextSizeLabel()}
          >
            <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span className="hidden md:inline">{getTextSizeLabel()}</span>
          </button>

          {/* Auto Read-Aloud Toggle */}
          <button
            onClick={() => onUpdateSettings({ autoReadAloud: !settings.autoReadAloud })}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              settings.autoReadAloud
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Toggle automatic speech read-aloud when lessons load"
            aria-pressed={settings.autoReadAloud}
            aria-label={`Auto Read-Aloud is currently ${settings.autoReadAloud ? 'On' : 'Off'}`}
          >
            {settings.autoReadAloud ? (
              <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" aria-hidden="true" />
            )}
            <span className="hidden lg:inline">
              Auto Read-Aloud: {settings.autoReadAloud ? 'On' : 'Off'}
            </span>
          </button>

          <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block" aria-hidden="true" />

          {/* Keyboard Shortcuts Guide */}
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors flex items-center gap-1"
            title="View keyboard shortcuts (Space to toggle mic, Esc to stop)"
            aria-label="View Keyboard Shortcuts guide"
          >
            <HelpCircle className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
            <span className="hidden xl:inline">Shortcuts</span>
          </button>

          {/* PM Impact Metrics Button */}
          <button
            onClick={onOpenMetrics}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            title="View PM Impact Metrics & Satisfaction Tracker"
            aria-label="Open PM Impact Metrics and testing statistics"
          >
            <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span>Impact Metrics</span>
          </button>

          {/* Gemini API Key Settings Button */}
          <button
            onClick={onOpenApiKey}
            className={`p-1.5 sm:px-2 sm:py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors ${
              hasApiKey
                ? 'border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30'
            }`}
            title="Manage Google Gemini API Key"
            aria-label="Open Gemini API Key settings"
          >
            <KeyRound className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">
              {hasApiKey ? 'API Key Active' : 'Set API Key'}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};


