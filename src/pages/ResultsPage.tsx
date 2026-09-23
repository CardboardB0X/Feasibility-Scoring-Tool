import React, { useState } from 'react';
import { CapstoneTitle, Researcher } from '../types/scoring';
import { METERS, QUESTIONS } from '../data/rubric';
import { calculateTitleSummary, getRankedTitles } from '../utils/calculator';
import { ScoreGauge } from '../components/ScoreGauge';
import { RedLineBanner } from '../components/RedLineBanner';
import {
  Trophy,
  ArrowLeft,
  FileText,
  BarChart3,
  Sparkles,
  Printer,
  Edit,
  Play,
  Users,
  AlertTriangle,
  Award,
  XCircle,
  ShieldAlert,
  CheckCircle2,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  Scale,
  Check
} from 'lucide-react';
import clsx from 'clsx';

interface ResultsPageProps {
  titles: CapstoneTitle[];
  activeTitleId: string;
  onSelectTitle: (id: string) => void;
  researchers: Researcher[];
  activeResearcherId: string;
  onSelectResearcher: (id: string) => void;
  onNavigate: (page: any) => void;
  onSelectTitleToScore: (titleId: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  titles,
  activeTitleId,
  onSelectTitle,
  researchers,
  activeResearcherId,
  onSelectResearcher,
  onNavigate,
  onSelectTitleToScore
}) => {
  const [viewMode, setViewMode] = useState<'ANALYSIS' | 'COMPARISON' | 'MATRIX'>('ANALYSIS');

  const activeTitle = titles.find((t) => t.id === activeTitleId) || titles[0];
  const summary = calculateTitleSummary(activeTitle, activeResearcherId, researchers);
  const rankedTitles = getRankedTitles(titles, activeResearcherId, researchers);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] pb-24 px-4 sm:px-6 max-w-7xl mx-auto pt-6 selection:bg-[#0071e3] selection:text-white">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0071e3] transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] tracking-tight">
            Feasibility Outcomes & Analytics
          </h1>
        </div>

        {/* Apple Segmented View Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Evaluator Switcher */}
          <div className="flex items-center rounded-2xl border border-black/[0.08] bg-white p-1">
            <Users className="h-3.5 w-3.5 text-slate-400 ml-2" />
            <select
              value={activeResearcherId}
              onChange={(e) => onSelectResearcher(e.target.value)}
              className="bg-transparent px-2.5 py-1 text-xs font-bold text-[#1d1d1f] focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="ALL_AGGREGATED">👥 Consensus (All)</option>
              {researchers.map((r) => (
                <option key={r.id} value={r.id}>
                  👤 {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex rounded-2xl bg-black/[0.05] p-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('ANALYSIS')}
              className={clsx(
                "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                viewMode === 'ANALYSIS'
                  ? "bg-white text-[#1d1d1f] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Title Analysis</span>
            </button>

            <button
              onClick={() => setViewMode('COMPARISON')}
              className={clsx(
                "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                viewMode === 'COMPARISON'
                  ? "bg-white text-[#1d1d1f] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#0071e3]" />
              <span>Comparison Tool</span>
            </button>

            <button
              onClick={() => setViewMode('MATRIX')}
              className={clsx(
                "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                viewMode === 'MATRIX'
                  ? "bg-white text-[#1d1d1f] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>Defense Rankings</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            title="Print or Save PDF Report"
            className="flex items-center gap-1.5 rounded-2xl border border-black/[0.08] bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print Report</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SINGLE TITLE ANALYSIS */}
      {viewMode === 'ANALYSIS' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Title Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-slate-400 mr-1 uppercase tracking-wider text-[11px]">
              Select Title:
            </span>
            {titles.map((t, idx) => {
              const isActive = t.id === activeTitleId;
              const tSummary = calculateTitleSummary(t, activeResearcherId, researchers);

              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTitle(t.id)}
                  className={clsx(
                    "flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2 font-semibold transition-all cursor-pointer",
                    isActive
                      ? "bg-[#0071e3] text-white shadow-xs"
                      : "bg-white border border-black/[0.06] text-slate-700 hover:border-black/[0.12]"
                  )}
                >
                  <span>Title {idx + 1}</span>
                  {tSummary.isRedLineTriggered ? (
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                  ) : tSummary.verdict === 'Approved Finalist' && tSummary.isComplete ? (
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  ) : (
                    <span className="font-mono text-[10px] opacity-75">
                      ({tSummary.answeredCount}/18)
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Title Banner */}
          <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="rounded-lg bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-xs font-bold text-[#0071e3]">
                {activeTitle.category || 'General'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1d1d1f] tracking-tight">
                {activeTitle.title}
              </h2>
              {activeTitle.description && (
                <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
                  {activeTitle.description}
                </p>
              )}
            </div>

            <button
              onClick={() => onSelectTitleToScore(activeTitle.id)}
              className="flex items-center gap-2 rounded-2xl bg-[#0071e3] text-white px-4 py-2.5 text-xs font-bold shadow-xs hover:bg-[#0077ed] active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Open Questionnaire</span>
            </button>
          </div>

          {/* Red Line Banner */}
          <RedLineBanner violations={summary.redLineViolations} />

          {/* Main Grid: Score Gauge Sidebar & 6-Meter Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: 6-Meter Feasibility Breakdown */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 shadow-xs">
                <h3 className="text-base font-extrabold text-[#1d1d1f] tracking-tight mb-4 flex items-center justify-between">
                  <span>6-Meter Weighted Performance</span>
                  <span className="text-xs text-slate-400 font-normal">Weights total 100%</span>
                </h3>

                <div className="space-y-4">
                  {summary.meterScores.map((meter, idx) => {
                    const pct = Math.round((meter.rawAverage / 5) * 100);
                    const isPassing = meter.rawAverage >= 3.30;

                    return (
                      <div key={meter.meterId} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#1d1d1f]">
                            M{meter.meterId}: {meter.meterName} ({meter.weightPercent}%)
                          </span>
                          <span className="font-mono font-bold text-slate-700">
                            {meter.rawAverage.toFixed(2)} / 5.00
                          </span>
                        </div>

                        <div className="h-2.5 w-full rounded-full bg-black/[0.05] overflow-hidden">
                          <div
                            className={clsx(
                              "h-full rounded-full transition-all duration-500",
                              meter.rawAverage >= 4.0
                                ? "bg-emerald-500"
                                : meter.rawAverage >= 3.3
                                ? "bg-amber-500"
                                : "bg-red-500"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Adviser Defense Pitch Summary */}
              <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#0071e3]" />
                  <h3 className="text-base font-extrabold text-[#1d1d1f]">
                    Adviser & Defense Pitch Guidance
                  </h3>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 text-xs text-blue-950 space-y-2 leading-relaxed">
                  <p className="font-bold">
                    Strategic Defense Angle:
                  </p>
                  <p>
                    {summary.verdict === 'Approved Finalist'
                      ? 'This title demonstrates strong technical depth and clear feasibility boundaries. Prioritize empirical validation benchmarks during title proposal defense.'
                      : summary.verdict === 'Conditional Backup'
                      ? 'This title requires tighter scope delimitation in Chapter 1. Isolate risky external dependencies to prevent timeline creep.'
                      : 'High risk of panel rejection due to inadequate algorithmic depth or unresolved feasibility constraints.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Score Gauge */}
            <div className="lg:col-span-5">
              <ScoreGauge summary={summary} />
            </div>
          </div>

          {/* Criteria & Evaluator Answers Review Breakdown */}
          <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.06]">
              <div>
                <h3 className="text-lg font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#0071e3]" />
                  <span>18-Criteria Rubric Breakdown & Answers Review</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Inspecting individual rubric scores for <strong>{activeTitle.title}</strong>.{' '}
                  {activeResearcherId === 'ALL_AGGREGATED'
                    ? 'Displaying consensus average scores across all evaluators.'
                    : `Displaying answers submitted by ${researchers.find((r) => r.id === activeResearcherId)?.name || 'Evaluator'}.`}
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-slate-500 bg-black/[0.04] px-3 py-1.5 rounded-xl self-start sm:self-auto">
                {summary.answeredCount} / 18 Answered
              </div>
            </div>

            {/* Grouped by Meter (M1 to M6) */}
            <div className="space-y-6">
              {METERS.map((meter) => {
                const meterQuestions = QUESTIONS.filter((q) => q.meterId === meter.id);
                const meterScore = summary.meterScores.find((m) => m.meterId === meter.id);

                return (
                  <div key={meter.id} className="rounded-2xl border border-black/[0.06] bg-slate-50/50 p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-black/[0.04] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-[#0071e3] text-white px-2 py-0.5 font-mono text-[10px] font-bold">
                          M{meter.id}
                        </span>
                        <span className="font-extrabold text-xs text-[#1d1d1f]">
                          {meter.name}
                        </span>
                      </div>

                      {meterScore && (
                        <span className="font-mono text-xs font-black text-[#0071e3]">
                          {meterScore.rawAverage.toFixed(2)} / 5.00
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      {meterQuestions.map((q) => {
                        const isAggregated = activeResearcherId === 'ALL_AGGREGATED';
                        const isRedLineQ = q.id === 'Q1' || q.id === 'Q4' || q.id === 'Q5';

                        if (isAggregated) {
                          const rScores = researchers.map((r) => ({
                            evaluator: r,
                            point: activeTitle.evaluations?.[r.id]?.[q.id]
                          }));
                          const scoredList = rScores.filter((item) => item.point !== undefined);
                          const avgPoint = scoredList.length > 0
                            ? (scoredList.reduce((acc, curr) => acc + (curr.point || 0), 0) / scoredList.length).toFixed(1)
                            : null;
                          const hasViolation = isRedLineQ && scoredList.some((s) => s.point === 1);

                          return (
                            <div
                              key={q.id}
                              className={clsx(
                                "rounded-xl border p-3.5 bg-white transition-all text-xs",
                                hasViolation ? "border-red-300 bg-red-50/30" : "border-black/[0.06]"
                              )}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-black text-[#0071e3]">{q.id}</span>
                                    <span className="font-bold text-[#1d1d1f]">{q.meterName}</span>
                                    {isRedLineQ && (
                                      <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[9px] font-bold">
                                        Red Line Check
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-600 text-[11px]">{q.text}</p>
                                </div>

                                <div className="font-mono font-black text-sm text-[#0071e3] self-end sm:self-auto shrink-0">
                                  {avgPoint ? `Avg ${avgPoint} / 5` : 'Unanswered'}
                                </div>
                              </div>

                              {/* Teammate score chips */}
                              <div className="pt-2 border-t border-black/[0.04] flex flex-wrap items-center gap-1.5 text-[11px]">
                                <span className="text-slate-400 font-semibold text-[10px] mr-1">Evaluators:</span>
                                {rScores.map(({ evaluator, point }) => (
                                  <span
                                    key={evaluator.id}
                                    className={clsx(
                                      "px-2 py-0.5 rounded-lg font-mono font-bold text-[10px] flex items-center gap-1 border",
                                      point === undefined
                                        ? "bg-slate-50 text-slate-400 border-black/[0.04]"
                                        : isRedLineQ && point === 1
                                        ? "bg-red-100 text-red-700 border-red-200"
                                        : point >= 4
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : point === 3
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-red-50 text-red-600 border-red-200"
                                    )}
                                  >
                                    <span className="font-sans font-medium">{evaluator.name}:</span>
                                    <span>{point !== undefined ? `${point}/5` : 'Pending'}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        } else {
                          const score = activeTitle.evaluations?.[activeResearcherId]?.[q.id];
                          const hasScore = score !== undefined;
                          const matchedOption = hasScore ? q.options.find((opt) => opt.point === score) : null;
                          const isViolation = isRedLineQ && score === 1;

                          return (
                            <div
                              key={q.id}
                              className={clsx(
                                "rounded-xl border p-3.5 bg-white transition-all text-xs",
                                isViolation
                                  ? "border-red-300 bg-red-50/40"
                                  : hasScore
                                  ? "border-black/[0.06]"
                                  : "border-dashed border-black/[0.08] bg-slate-50/50"
                              )}
                            >
                              <div className="flex items-start justify-between gap-3 mb-1.5">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-black text-[#0071e3]">{q.id}</span>
                                    <span className="font-bold text-[#1d1d1f]">{q.meterName}</span>
                                    {isRedLineQ && (
                                      <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[9px] font-bold">
                                        Red Line Check
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-600 text-[11px]">{q.text}</p>
                                </div>

                                <div className="shrink-0 font-mono font-black text-sm">
                                  {hasScore ? (
                                    <span
                                      className={clsx(
                                        "px-2.5 py-0.5 rounded-xl border shadow-2xs",
                                        isViolation
                                          ? "bg-red-500 text-white border-red-600"
                                          : score >= 4
                                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                          : score === 3
                                          ? "bg-amber-50 text-amber-700 border-amber-200"
                                          : "bg-red-50 text-red-600 border-red-200"
                                      )}
                                    >
                                      {score} / 5
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 bg-black/[0.04] px-2 py-0.5 rounded-lg">
                                      Unanswered
                                    </span>
                                  )}
                                </div>
                              </div>

                              {matchedOption && (
                                <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-black/[0.04] text-[11px] text-slate-700">
                                  <span className="font-bold text-[#1d1d1f]">{matchedOption.label}: </span>
                                  <span>{matchedOption.description}</span>
                                </div>
                              )}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CANDIDATE TITLE COMPARISON TOOL */}
      {viewMode === 'COMPARISON' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Recommendation Spotlight Card */}
          {rankedTitles.length > 0 && (
            <div className="rounded-[28px] border border-black/[0.08] bg-gradient-to-br from-white via-blue-50/20 to-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                      <Trophy className="h-3.5 w-3.5 text-amber-500" />
                      <span>Recommended Defense Pick</span>
                    </span>
                    <span className="rounded-lg bg-black/[0.04] px-2.5 py-0.5 text-xs font-bold text-slate-600">
                      Rank #1 of {titles.length}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-[#1d1d1f] tracking-tight">
                    {rankedTitles[0].title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                    Highest Composite Title Score with zero Red Line disqualifications. Demonstrates maximum defensibility under panel interrogation and established technical feasibility.
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="rounded-2xl border border-black/[0.08] bg-white p-4 text-center shadow-xs min-w-[120px]">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CTS Score</div>
                    <div className="text-3xl font-black font-mono text-[#0071e3]">
                      {calculateTitleSummary(rankedTitles[0], activeResearcherId, researchers).cts.toFixed(2)}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600 mt-0.5">Approved Finalist</div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTitle(rankedTitles[0].id);
                      setViewMode('ANALYSIS');
                    }}
                    className="flex items-center gap-1.5 rounded-2xl bg-[#0071e3] text-white px-4 py-3 text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-[#0077ed] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Full Analysis</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison Grid */}
          <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.06]">
              <div>
                <h3 className="text-xl font-extrabold text-[#1d1d1f] tracking-tight flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-[#0071e3]" />
                  <span>Side-by-Side Candidate Titles Comparison</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Cross-evaluating all {titles.length} candidate proposals across composite score, meter breakdown, red lines, and feasibility trade-offs.
                </p>
              </div>

              <div className="text-xs font-bold text-slate-500 bg-black/[0.04] px-3 py-1.5 rounded-xl self-start sm:self-auto">
                Comparing: {activeResearcherId === 'ALL_AGGREGATED' ? '👥 Group Consensus' : `👤 ${researchers.find(r => r.id === activeResearcherId)?.name || 'Evaluator'}`}
              </div>
            </div>

            {/* Scrollable / Multi-column Card Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {titles.map((t, idx) => {
                const tSummary = calculateTitleSummary(t, activeResearcherId, researchers);
                const rankIdx = rankedTitles.findIndex((rt) => rt.id === t.id) + 1;
                const isWinner = rankIdx === 1 && !tSummary.isRedLineTriggered && tSummary.cts >= 4.0;

                return (
                  <div
                    key={t.id}
                    className={clsx(
                      "flex flex-col justify-between rounded-2xl border p-5 transition-all shadow-xs",
                      isWinner
                        ? "border-[#0071e3]/40 bg-blue-50/15 ring-2 ring-[#0071e3]/20"
                        : "border-black/[0.08] bg-white hover:border-black/[0.15]"
                    )}
                  >
                    <div className="space-y-4">
                      {/* Title Header */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-slate-500 bg-black/[0.04] px-2.5 py-1 rounded-lg">
                            RANK #{rankIdx} &bull; TITLE {idx + 1}
                          </span>

                          <span className="rounded-lg bg-blue-50 border border-blue-200/60 px-2 py-0.5 text-[11px] font-bold text-[#0071e3] truncate max-w-[130px]">
                            {t.category || 'General'}
                          </span>
                        </div>

                        <h4 className="text-base font-extrabold text-[#1d1d1f] tracking-tight leading-snug line-clamp-2 min-h-[2.75rem]">
                          {t.title.trim() ? t.title : `Untitled Title #${idx + 1}`}
                        </h4>
                      </div>

                      {/* CTS Score Gauge Box */}
                      <div className="rounded-xl border border-black/[0.06] bg-slate-50/70 p-3.5 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Composite Score (CTS)
                          </div>
                          <div className="font-mono text-2xl font-black text-[#0071e3]">
                            {tSummary.cts.toFixed(2)}
                            <span className="text-xs text-slate-400 font-normal"> / 5.00</span>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          {tSummary.isRedLineTriggered ? (
                            <span className="inline-block rounded-full bg-red-100 text-red-700 px-2.5 py-0.5 text-[10px] font-bold">
                              🚨 Disqualified
                            </span>
                          ) : tSummary.verdict === 'Approved Finalist' ? (
                            <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold">
                              🌟 Approved Finalist
                            </span>
                          ) : tSummary.verdict === 'Conditional Backup' ? (
                            <span className="inline-block rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold">
                              ⚠️ Conditional Backup
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-[10px] font-bold">
                              Discarded
                            </span>
                          )}
                          <div className="text-[10px] font-mono text-slate-400">
                            {tSummary.answeredCount} / 18 Answered
                          </div>
                        </div>
                      </div>

                      {/* Red Line Status */}
                      <div className="text-xs">
                        {tSummary.isRedLineTriggered ? (
                          <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 text-red-800 text-[11px] font-semibold space-y-0.5">
                            <div className="font-bold flex items-center gap-1">
                              <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                              <span>Red Line Disqualification Triggered</span>
                            </div>
                            <div className="text-[10px] text-red-700 font-normal">
                              {tSummary.redLineViolations[0]?.blockerReason || 'Critical constraint failure.'}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold bg-emerald-50/70 border border-emerald-200/60 px-2.5 py-1.5 rounded-xl">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>0 Red Line Blockers (Clean Clearance)</span>
                          </div>
                        )}
                      </div>

                      {/* 6 Meters Comparative Bars */}
                      <div className="space-y-2 pt-2 border-t border-black/[0.04]">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          6-Meter Breakdown
                        </div>

                        {tSummary.meterScores.map((meter) => {
                          const pct = Math.round((meter.rawAverage / 5) * 100);

                          return (
                            <div key={meter.meterId} className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-semibold text-slate-700 truncate max-w-[180px]">
                                  M{meter.meterId}: {meter.meterName}
                                </span>
                                <span className="font-mono font-bold text-slate-800">
                                  {meter.rawAverage.toFixed(2)}
                                </span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-black/[0.05] overflow-hidden">
                                <div
                                  className={clsx(
                                    "h-full rounded-full transition-all duration-300",
                                    meter.rawAverage >= 4.0
                                      ? "bg-emerald-500"
                                      : meter.rawAverage >= 3.3
                                      ? "bg-amber-500"
                                      : "bg-red-500"
                                  )}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-5 pt-3 border-t border-black/[0.06] flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          onSelectTitle(t.id);
                          setViewMode('ANALYSIS');
                        }}
                        className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer text-center"
                      >
                        Deep-Dive Analysis &rarr;
                      </button>

                      <button
                        onClick={() => onSelectTitleToScore(t.id)}
                        title="Score this title in questionnaire"
                        className="py-2 px-3 rounded-xl border border-black/[0.08] hover:bg-slate-50 text-xs font-bold text-[#0071e3] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Score</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CROSS-TITLE DEFENSE RANKINGS */}
      {viewMode === 'MATRIX' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xs">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-[#1d1d1f] tracking-tight">
                  Cross-Title Leaderboard & Defense Rankings
                </h2>
                <p className="text-xs text-slate-500">
                  Side-by-side comparison of all candidate titles ranked by Composite Title Score (CTS).
                </p>
              </div>

              <span className="font-mono text-xs font-bold text-slate-400">
                {titles.length} Titles Evaluated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.08] text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Candidate Title</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Answered</th>
                    <th className="py-3 px-3">CTS Score</th>
                    <th className="py-3 px-3">Verdict</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {rankedTitles.map((t: CapstoneTitle, idx: number) => {
                    const tSummary = calculateTitleSummary(t, activeResearcherId, researchers);

                    return (
                      <tr key={t.id} className="hover:bg-black/[0.02] transition-colors">
                        <td className="py-4 px-3 font-mono font-black text-slate-400">
                          #{idx + 1}
                        </td>
                        <td className="py-4 px-3 font-bold text-[#1d1d1f] max-w-[280px] truncate">
                          {t.title}
                        </td>
                        <td className="py-4 px-3">
                          <span className="rounded-md bg-black/[0.04] px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                            {t.category || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-3 font-mono text-slate-500">
                          {tSummary.answeredCount} / 18
                        </td>
                        <td className="py-4 px-3 font-mono font-black text-sm text-[#0071e3]">
                          {tSummary.cts.toFixed(2)}
                        </td>
                        <td className="py-4 px-3">
                          {tSummary.isRedLineTriggered ? (
                            <span className="rounded-full bg-red-100 text-red-700 px-2.5 py-0.5 text-[10px] font-bold">
                              🚨 Disqualified
                            </span>
                          ) : tSummary.verdict === 'Approved Finalist' ? (
                            <span className="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold">
                              🌟 Approved Finalist
                            </span>
                          ) : tSummary.verdict === 'Conditional Backup' ? (
                            <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold">
                              ⚠️ Conditional Backup
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-[10px] font-bold">
                              Discarded
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button
                            onClick={() => {
                              onSelectTitle(t.id);
                              setViewMode('ANALYSIS');
                            }}
                            className="text-xs font-bold text-[#0071e3] hover:underline cursor-pointer"
                          >
                            View Details &rarr;
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
