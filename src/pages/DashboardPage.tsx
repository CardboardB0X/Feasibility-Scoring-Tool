import React from 'react';
import { CapstoneTitle, Researcher } from '../types/scoring';
import { AuthSession } from '../types/auth';
import { calculateTitleSummary } from '../utils/calculator';
import {
  Layers,
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Copy,
  Check,
  Settings,
  Trophy,
  FileText,
  RotateCcw,
  DoorOpen,
  Lock,
  Plus,
  Trash2
} from 'lucide-react';
import clsx from 'clsx';

interface DashboardPageProps {
  roomCode: string;
  titles: CapstoneTitle[];
  researchers: Researcher[];
  activeResearcherId: string;
  session: AuthSession | null;
  onSelectTitleToScore: (titleId: string) => void;
  onSelectTitleToViewResults: (titleId: string) => void;
  onNavigate: (page: any) => void;
  onExitRoom: () => void;
  onClearAllData?: () => void;
  isSyncing: boolean;
  onSync: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  roomCode,
  titles,
  researchers,
  activeResearcherId,
  session,
  onSelectTitleToScore,
  onSelectTitleToViewResults,
  onNavigate,
  onExitRoom,
  onClearAllData,
  isSyncing,
  onSync
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentEvaluator =
    researchers.find((r) => r.id === activeResearcherId) || researchers[0];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] pb-24 px-4 sm:px-6 max-w-7xl mx-auto pt-6 selection:bg-[#0071e3] selection:text-white">
      {/* Top Banner / Room Overview */}
      <div className="rounded-[28px] border border-black/[0.08] bg-white/95 backdrop-blur-2xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base sm:text-lg font-black tracking-widest text-[#1d1d1f] bg-black/[0.05] px-3 py-1 rounded-xl">
                {roomCode}
              </span>

              <button
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1 rounded-xl border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-[#0071e3] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span>AES-256 Encrypted Sync</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
              Evaluation Room Dashboard
            </h1>

            <p className="text-xs sm:text-sm text-slate-500">
              Evaluating <strong>{titles.length} candidate titles</strong> across {researchers.length} team evaluator{researchers.length !== 1 ? 's' : ''}.
              Scoring is distraction-free with zero spoilers during evaluation.
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('results')}
              className="flex items-center gap-2 rounded-2xl bg-[#1d1d1f] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:bg-black active:scale-[0.98] transition-all cursor-pointer"
            >
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>Consolidated Results & Matrix</span>
            </button>

            <button
              onClick={() => onNavigate('edit')}
              className="flex items-center gap-2 rounded-2xl border border-black/[0.08] bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Edit Titles & Team</span>
            </button>

            <button
              onClick={onExitRoom}
              title="Exit this room"
              className="flex items-center gap-1.5 rounded-2xl border border-black/[0.08] bg-white p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <DoorOpen className="h-4 w-4" />
            </button>

            {onClearAllData && (
              <button
                onClick={onClearAllData}
                title="Clear all data and reset"
                className="flex items-center gap-1.5 rounded-2xl border border-red-200 bg-white p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer shadow-2xs"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Candidate Titles Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-extrabold text-[#1d1d1f] tracking-tight">
              Candidate Titles to Evaluate ({titles.length})
            </h2>
            <p className="text-xs text-slate-500">
              Click on any title to launch the Quizizz-style flashcard questionnaire.
            </p>
          </div>

          <button
            onClick={() => onNavigate('edit')}
            className="flex items-center gap-1 text-xs font-bold text-[#0071e3] hover:underline cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add / Edit Titles</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {titles.map((title, idx) => {
            const summary = calculateTitleSummary(title, activeResearcherId, researchers);
            const answeredCount = summary.answeredCount;
            const isComplete = answeredCount === 18;
            const progressPercent = Math.round((answeredCount / 18) * 100);

            return (
              <div
                key={title.id}
                className="group relative flex flex-col justify-between rounded-[28px] border border-black/[0.08] bg-white p-6 shadow-xs hover:border-[#0071e3]/40 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-black/[0.04] px-2.5 py-1 rounded-lg">
                      TITLE #{idx + 1}
                    </span>

                    <span className="rounded-lg bg-blue-50 border border-blue-200/60 px-2 py-0.5 text-[11px] font-bold text-[#0071e3] truncate max-w-[140px]">
                      {title.category || 'General'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-[#1d1d1f] tracking-tight leading-snug line-clamp-2 min-h-[3rem]">
                    {title.title.trim() ? title.title : `Untitled Title #${idx + 1}`}
                  </h3>

                  {title.description && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {title.description}
                    </p>
                  )}

                  {/* Progress Bar (Quizizz-Style) */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500">Evaluation Progress</span>
                      <span className="font-mono font-bold text-[#1d1d1f]">
                        {answeredCount} / 18 ({progressPercent}%)
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-black/[0.05] overflow-hidden">
                      <div
                        className={clsx(
                          "h-full rounded-full transition-all duration-500",
                          isComplete ? "bg-emerald-500" : "bg-[#0071e3]"
                        )}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-6 pt-4 border-t border-black/[0.05] flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectTitleToScore(title.id)}
                    className={clsx(
                      "flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.98]",
                      isComplete
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-800"
                        : "bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-blue-500/20"
                    )}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{isComplete ? 'Review Answers' : answeredCount > 0 ? 'Continue Questionnaire' : 'Start Questionnaire'}</span>
                  </button>

                  {isComplete && (
                    <button
                      onClick={() => onSelectTitleToViewResults(title.id)}
                      title="View Results & Feasibility Analysis"
                      className="min-h-[44px] px-3.5 rounded-xl border border-black/[0.1] bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      Outcomes
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
