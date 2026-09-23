import React, { useState } from 'react';
import { CapstoneTitle, Researcher } from '../types/scoring';
import { METERS } from '../data/rubric';
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
  ChevronRight
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
  const [viewMode, setViewMode] = useState<'ANALYSIS' | 'MATRIX'>('ANALYSIS');

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
          <p className="text-xs sm:text-sm text-slate-500">
            Comprehensive rubric outcomes, Composite Title Score (CTS), Red Line checks, and ranking matrix.
          </p>
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
              onClick={() => setViewMode('MATRIX')}
              className={clsx(
                "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                viewMode === 'MATRIX'
                  ? "bg-white text-[#1d1d1f] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>Comparison Matrix</span>
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
        </div>
      )}

      {/* VIEW 2: CROSS-TITLE COMPARISON MATRIX */}
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
