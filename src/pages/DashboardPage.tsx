import React, { useState } from 'react';
import { CapstoneTitle, Researcher } from '../types/scoring';
import { GuestSession, AuthSession } from '../types/auth';
import { calculateTitleSummary } from '../utils/calculator';
import { QUESTIONS } from '../data/rubric';
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
  Eye,
  X,
  AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';

interface DashboardPageProps {
  roomCode: string;
  titles: CapstoneTitle[];
  researchers: Researcher[];
  activeResearcherId: string;
  session: GuestSession | AuthSession | null;
  onSelectTitleToScore: (titleId: string) => void;
  onSelectTitleToViewResults: (titleId: string) => void;
  onNavigate: (page: any) => void;
  onExitRoom: () => void;
  isSyncing: boolean;
  onSync: () => void;
  onSelectResearcher?: (id: string) => void;
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
  isSyncing,
  onSync,
  onSelectResearcher
}) => {
  const [copied, setCopied] = useState(false);
  const [reviewingEvaluator, setReviewingEvaluator] = useState<Researcher | null>(null);
  const [reviewTitleId, setReviewTitleId] = useState<string>(titles[0]?.id || 'TITLE-1');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentEvaluator =
    researchers.find((r) => r.id === activeResearcherId) || researchers[0];

  const activeReviewTitle =
    titles.find((t) => t.id === reviewTitleId) || titles[0];

  const reviewTitleSummary = reviewingEvaluator && activeReviewTitle
    ? calculateTitleSummary(activeReviewTitle, reviewingEvaluator.id, researchers)
    : null;

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
                className={clsx(
                  "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer",
                  copied
                    ? "animate-copy-glow bg-emerald-50 border-emerald-300 text-emerald-700 ring-2 ring-emerald-400/40"
                    : "border-black/[0.08] bg-white text-slate-700 hover:text-[#0071e3] hover:border-[#0071e3]/30"
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                    <span>Copied Room Code!</span>
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
          </div>
        </div>
      </div>

      {/* Evaluators in Room Section */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-lg font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2">
              <Users className="h-5 w-5 text-[#0071e3]" />
              <span>Evaluators in Room ({researchers.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Team members scoring in this room. Individual data is preserved and combined into group consensus.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {researchers.map((evaluator) => {
            const isMe = session?.id === evaluator.id;
            // Calculate total questions answered by this evaluator across all titles
            const totalQuestionsPossible = titles.length * 18;
            let totalAnsweredCount = 0;
            let sumCts = 0;
            let completedTitlesCount = 0;

            const titleScores = titles.map((t, idx) => {
              const tSummary = calculateTitleSummary(t, evaluator.id, researchers);
              totalAnsweredCount += tSummary.answeredCount;
              if (tSummary.answeredCount === 18) {
                completedTitlesCount += 1;
                sumCts += tSummary.cts;
              }
              return {
                titleNum: idx + 1,
                titleName: t.title,
                cts: tSummary.cts,
                answered: tSummary.answeredCount,
                isComplete: tSummary.answeredCount === 18,
                verdict: tSummary.verdict,
                isRedLine: tSummary.isRedLineTriggered
              };
            });

            const overallPercent = totalQuestionsPossible > 0
              ? Math.round((totalAnsweredCount / totalQuestionsPossible) * 100)
              : 0;
            const avgCts = completedTitlesCount > 0
              ? (sumCts / completedTitlesCount).toFixed(2)
              : null;

            return (
              <div
                key={evaluator.id}
                className={clsx(
                  "flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all hover:shadow-md",
                  isMe ? "border-[#0071e3]/40 bg-blue-50/20" : "border-black/[0.08]"
                )}
              >
                <div>
                  {/* Evaluator identity header */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={clsx(
                          "flex h-9 w-9 items-center justify-center rounded-xl text-white font-bold text-xs shadow-2xs",
                          evaluator.avatarColor || 'bg-[#0071e3]'
                        )}
                      >
                        {evaluator.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-extrabold text-[#1d1d1f]">
                            {evaluator.name}
                          </span>
                          {isMe && (
                            <span className="rounded-full bg-[#0071e3] text-white px-2 py-0.2 text-[10px] font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {evaluator.role || 'Evaluator'}
                        </span>
                      </div>
                    </div>

                    {avgCts ? (
                      <span className="font-mono text-xs font-black text-[#0071e3] bg-blue-50 px-2 py-1 rounded-lg border border-blue-200/50">
                        Avg CTS {avgCts}
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 bg-black/[0.03] px-2 py-0.5 rounded-lg">
                        In Progress
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-semibold">Evaluation Completion</span>
                      <span className="font-mono font-bold text-slate-700">
                        {totalAnsweredCount} / {totalQuestionsPossible} ({overallPercent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-black/[0.05] overflow-hidden">
                      <div
                        className={clsx(
                          "h-full rounded-full transition-all duration-500",
                          overallPercent === 100 ? "bg-emerald-500" : "bg-[#0071e3]"
                        )}
                        style={{ width: `${overallPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Per-title scores mini pills */}
                  <div className="mt-3 pt-3 border-t border-black/[0.04]">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Individual Title Scores
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {titleScores.map((ts) => (
                        <div
                          key={ts.titleNum}
                          className={clsx(
                            "px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border",
                            ts.isRedLine
                              ? "bg-red-50 text-red-700 border-red-200"
                              : ts.isComplete
                              ? "bg-slate-50 text-slate-800 border-black/[0.06]"
                              : "bg-black/[0.02] text-slate-400 border-black/[0.04]"
                          )}
                          title={`Title ${ts.titleNum}: ${ts.titleName}`}
                        >
                          <span className="text-slate-400 font-sans font-semibold">T{ts.titleNum}:</span>
                          <span>{ts.isComplete ? ts.cts.toFixed(2) : `${ts.answered}/18`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action: Review Answers */}
                <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center gap-2">
                  <button
                    onClick={() => {
                      setReviewingEvaluator(evaluator);
                      setReviewTitleId(titles[0]?.id || 'TITLE-1');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-black/[0.08] bg-white hover:bg-slate-50 active:scale-[0.98] py-2 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
                  >
                    <Eye className="h-3.5 w-3.5 text-[#0071e3]" />
                    <span>Review Answers</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectResearcher) {
                        onSelectResearcher(evaluator.id);
                      }
                      onNavigate('results');
                    }}
                    title="View Analytics for this Evaluator"
                    className="px-2.5 py-2 rounded-xl border border-black/[0.08] bg-white hover:bg-slate-50 text-slate-600 hover:text-[#0071e3] transition-colors cursor-pointer text-xs font-bold"
                  >
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  </button>
                </div>
              </div>
            );
          })}
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

      {/* Answer Review Modal: Inspect Any Evaluator's Responses */}
      {reviewingEvaluator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-[28px] bg-white p-6 sm:p-8 shadow-2xl border border-black/[0.08] my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.08] shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={clsx(
                    "flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm shadow-sm",
                    reviewingEvaluator.avatarColor || 'bg-[#0071e3]'
                  )}
                >
                  {reviewingEvaluator.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#1d1d1f]">
                      {reviewingEvaluator.name}'s Answer Review
                    </h3>
                    {session?.id === reviewingEvaluator.id && (
                      <span className="rounded-full bg-[#0071e3] text-white px-2 py-0.2 text-[10px] font-bold">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {reviewingEvaluator.role || 'Evaluator'} &bull; Reviewing submitted ratings for Room {roomCode}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setReviewingEvaluator(null)}
                className="h-8 w-8 rounded-full bg-black/[0.05] hover:bg-black/[0.1] flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Title Selector Tabs inside modal */}
            <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-black/[0.06] shrink-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Select Title:
              </span>
              {titles.map((t, idx) => {
                const isSelected = t.id === reviewTitleId;
                const tScores = t.evaluations?.[reviewingEvaluator.id] || {};
                const answered = Object.keys(tScores).length;

                return (
                  <button
                    key={t.id}
                    onClick={() => setReviewTitleId(t.id)}
                    className={clsx(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5",
                      isSelected
                        ? "bg-[#0071e3] text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    )}
                  >
                    <span>Title {idx + 1}</span>
                    <span className="font-mono text-[10px] opacity-75">
                      ({answered}/18)
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Title Banner in Modal */}
            {activeReviewTitle && reviewTitleSummary && (
              <div className="py-3 px-4 my-3 rounded-2xl bg-slate-50 border border-black/[0.06] flex items-center justify-between gap-4 shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {activeReviewTitle.category || 'General'}
                    </span>
                    <span className="text-xs font-extrabold text-[#1d1d1f] truncate">
                      {activeReviewTitle.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="font-mono font-black text-sm text-[#0071e3]">
                      CTS: {reviewTitleSummary.cts.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {reviewTitleSummary.answeredCount} / 18 Answered
                    </div>
                  </div>

                  {reviewTitleSummary.isRedLineTriggered ? (
                    <span className="rounded-full bg-red-100 text-red-700 px-2.5 py-0.5 text-[10px] font-bold">
                      🚨 Red Line
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold">
                      {reviewTitleSummary.verdict}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Questions & Rubric Answers List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2">
              {QUESTIONS.map((q) => {
                const userScore = activeReviewTitle?.evaluations?.[reviewingEvaluator.id]?.[q.id];
                const hasScore = userScore !== undefined;
                const matchedOption = hasScore
                  ? q.options.find((opt) => opt.point === userScore)
                  : null;
                const isRedLineQ = q.id === 'Q1' || q.id === 'Q4' || q.id === 'Q5';
                const isViolation = isRedLineQ && userScore === 1;

                return (
                  <div
                    key={q.id}
                    className={clsx(
                      "rounded-2xl border p-4 transition-all text-xs",
                      isViolation
                        ? "border-red-300 bg-red-50/40"
                        : hasScore
                        ? "border-black/[0.06] bg-white hover:border-black/[0.12]"
                        : "border-dashed border-black/[0.1] bg-slate-50/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-[#0071e3]">
                            {q.id}
                          </span>
                          <span className="font-bold text-[#1d1d1f]">
                            {q.meterName}
                          </span>
                          {isRedLineQ && (
                            <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[9px] font-bold">
                              Red Line Check
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                          {q.text}
                        </p>
                      </div>

                      {/* Evaluator Score Badge */}
                      <div className="shrink-0 text-right">
                        {hasScore ? (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={clsx(
                                "font-mono font-black text-sm px-2.5 py-0.5 rounded-xl border shadow-2xs",
                                isViolation
                                  ? "bg-red-500 text-white border-red-600"
                                  : userScore >= 4
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : userScore === 3
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-600 border-red-200"
                              )}
                            >
                              {userScore} / 5
                            </span>
                          </div>
                        ) : (
                          <span className="font-mono text-[10px] text-slate-400 bg-black/[0.04] px-2 py-0.5 rounded-lg">
                            Unanswered
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Matched Rubric Level Text */}
                    {matchedOption && (
                      <div
                        className={clsx(
                          "mt-2 p-2.5 rounded-xl text-[11px] leading-relaxed border",
                          isViolation
                            ? "bg-red-100/70 border-red-200 text-red-900"
                            : "bg-slate-50 border-black/[0.04] text-slate-700"
                        )}
                      >
                        <span className="font-bold text-[#1d1d1f]">
                          {matchedOption.label}:{' '}
                        </span>
                        <span>{matchedOption.description}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-black/[0.08] flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setReviewingEvaluator(null)}
                className="px-4 py-2 rounded-xl border border-black/[0.08] text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  if (onSelectResearcher) {
                    onSelectResearcher(reviewingEvaluator.id);
                  }
                  setReviewingEvaluator(null);
                  onNavigate('results');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0071e3] text-white text-xs font-bold shadow-xs hover:bg-[#0077ed] transition-colors cursor-pointer"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Open Full Analytics for {reviewingEvaluator.name} &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
