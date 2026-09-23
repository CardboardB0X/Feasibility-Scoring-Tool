import React, { useState } from 'react';
import { CapstoneTitle, Researcher, EvaluationSummary } from '../types/scoring';
import { calculateTitleSummary, exportToCSV } from '../utils/calculator';
import { X, Trophy, Download, Printer, ShieldAlert, Award, AlertTriangle, ExternalLink, Filter } from 'lucide-react';
import clsx from 'clsx';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  titles: CapstoneTitle[];
  activeResearcherId: string;
  researchers: Researcher[];
  onSelectTitle: (titleId: string) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  titles,
  activeResearcherId,
  researchers,
  onSelectTitle
}) => {
  const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'CONDITIONAL' | 'DISQUALIFIED' | 'DISCARDED'>('ALL');

  if (!isOpen) return null;

  // Calculate summaries for all titles
  const evaluatedTitles: { title: CapstoneTitle; summary: EvaluationSummary }[] = titles.map((title) => ({
    title,
    summary: calculateTitleSummary(title, activeResearcherId, researchers)
  }));

  // Sort: Non-disqualified with highest CTS first, then disqualified
  const sorted = [...evaluatedTitles].sort((a, b) => {
    if (a.summary.isRedLineTriggered && !b.summary.isRedLineTriggered) return 1;
    if (!a.summary.isRedLineTriggered && b.summary.isRedLineTriggered) return -1;
    return b.summary.cts - a.summary.cts;
  });

  // Filter
  const filtered = sorted.filter((item) => {
    if (filter === 'APPROVED') return item.summary.verdict === 'Approved Finalist';
    if (filter === 'CONDITIONAL') return item.summary.verdict === 'Conditional Backup';
    if (filter === 'DISQUALIFIED') return item.summary.isRedLineTriggered;
    if (filter === 'DISCARDED') return item.summary.verdict === 'Discarded' && !item.summary.isRedLineTriggered;
    return true;
  });

  const approvedCount = sorted.filter(s => s.summary.verdict === 'Approved Finalist').length;
  const conditionalCount = sorted.filter(s => s.summary.verdict === 'Conditional Backup').length;
  const disqualifiedCount = sorted.filter(s => s.summary.isRedLineTriggered).length;
  const discardedCount = sorted.filter(s => s.summary.verdict === 'Discarded' && !s.summary.isRedLineTriggered).length;

  const handleDownloadCSV = () => {
    const csvData = exportToCSV(titles, activeResearcherId, researchers);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Capstone_Title_Evaluations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col max-h-[92vh] w-full max-w-6xl rounded-[28px] bg-white/95 backdrop-blur-2xl shadow-2xl border border-black/[0.08] overflow-hidden apple-spring">
        {/* macOS Window Chrome Header */}
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-[#fbfbfd]/80 px-6 py-3.5 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:opacity-80 transition-opacity cursor-pointer"
            />
            <div className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
          </div>

          <div className="text-xs font-semibold text-slate-500 tracking-tight flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>Capstone Comparison Matrix • {titles.length} Proposed Titles</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-black/5 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6 border-b border-black/[0.06] bg-[#fbfbfd]/50">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-3.5">
            <div className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <Award className="h-3 w-3 text-[#34c759]" />
              Approved Finalists (≥ 4.00)
            </div>
            <div className="text-2xl font-black text-emerald-950 font-mono mt-0.5">
              {approvedCount} <span className="text-xs font-normal text-emerald-700">titles</span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-50/50 p-3.5">
            <div className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-[#ff9500]" />
              Conditional Backups (3.30–3.99)
            </div>
            <div className="text-2xl font-black text-amber-950 font-mono mt-0.5">
              {conditionalCount} <span className="text-xs font-normal text-amber-700">titles</span>
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-black/[0.02] p-3.5">
            <div className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
              Discarded (&lt; 3.30)
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
              {discardedCount} <span className="text-xs font-normal text-slate-500">titles</span>
            </div>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-50/60 p-3.5">
            <div className="text-[10px] font-black text-red-800 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="h-3 w-3 text-[#ff3b30]" />
              The Red Line Dropped
            </div>
            <div className="text-2xl font-black text-red-950 font-mono mt-0.5">
              {disqualifiedCount} <span className="text-xs font-normal text-red-700">titles</span>
            </div>
          </div>
        </div>

        {/* Apple Segmented Filter Bar */}
        <div className="flex items-center gap-1.5 px-6 pt-4 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={clsx(
              "px-3 py-1.5 rounded-xl transition-all cursor-pointer",
              filter === 'ALL'
                ? "bg-[#1d1d1f] text-white shadow-xs"
                : "bg-black/[0.04] text-slate-600 hover:bg-black/[0.08]"
            )}
          >
            All ({titles.length})
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={clsx(
              "px-3 py-1.5 rounded-xl transition-all cursor-pointer",
              filter === 'APPROVED'
                ? "bg-[#34c759] text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            )}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('CONDITIONAL')}
            className={clsx(
              "px-3 py-1.5 rounded-xl transition-all cursor-pointer",
              filter === 'CONDITIONAL'
                ? "bg-[#ff9500] text-white shadow-xs"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            )}
          >
            Conditional ({conditionalCount})
          </button>
          <button
            onClick={() => setFilter('DISQUALIFIED')}
            className={clsx(
              "px-3 py-1.5 rounded-xl transition-all cursor-pointer",
              filter === 'DISQUALIFIED'
                ? "bg-[#ff3b30] text-white shadow-xs"
                : "bg-red-50 text-red-800 hover:bg-red-100"
            )}
          >
            Red Line Disqualified ({disqualifiedCount})
          </button>
          <button
            onClick={() => setFilter('DISCARDED')}
            className={clsx(
              "px-3 py-1.5 rounded-xl transition-all cursor-pointer",
              filter === 'DISCARDED'
                ? "bg-slate-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            Discarded ({discardedCount})
          </button>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-black/[0.02] text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-black/[0.06]">
                  <th className="py-3 px-4 text-center w-12">Rank</th>
                  <th className="py-3 px-4 min-w-[240px]">Proposed Capstone Title</th>
                  <th className="py-3 px-3 text-center">Status Verdict</th>
                  <th className="py-3 px-3 text-center">CTS</th>
                  <th className="py-3 px-2 text-center" title="Meter 1: Tech Stack (20%)">M1 (20%)</th>
                  <th className="py-3 px-2 text-center" title="Meter 2: Data & Clearances (20%)">M2 (20%)</th>
                  <th className="py-3 px-2 text-center" title="Meter 3: Panel Depth (20%)">M3 (20%)</th>
                  <th className="py-3 px-2 text-center" title="Meter 4: Scope Delimitation (15%)">M4 (15%)</th>
                  <th className="py-3 px-2 text-center" title="Meter 5: Empirical Rigor (15%)">M5 (15%)</th>
                  <th className="py-3 px-2 text-center" title="Meter 6: Team Velocity (10%)">M6 (10%)</th>
                  <th className="py-3 px-3 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] font-medium text-slate-800">
                {filtered.map((item, index) => {
                  const s = item.summary;
                  const isDisqualified = s.isRedLineTriggered;

                  return (
                    <tr
                      key={item.title.id}
                      className={clsx(
                        "hover:bg-slate-50/80 transition-colors",
                        isDisqualified && "bg-red-50/25"
                      )}
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400 font-mono">
                        {isDisqualified ? '—' : `#${index + 1}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1d1d1f] leading-snug">
                          {item.title.title}
                        </div>
                        {item.title.category && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {item.title.category}
                          </div>
                        )}
                        {isDisqualified && s.redLineViolations.length > 0 && (
                          <div className="mt-1 text-[11px] font-bold text-red-600 flex items-center gap-1">
                            <ShieldAlert className="h-3 w-3 shrink-0" />
                            <span>
                              {s.redLineViolations.map(v => `${v.questionId} Blocker`).join(', ')}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={clsx(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide",
                            isDisqualified
                              ? "bg-[#ff3b30] text-white"
                              : s.verdict === 'Approved Finalist'
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : s.verdict === 'Conditional Backup'
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-slate-100 text-slate-700"
                          )}
                        >
                          {isDisqualified ? 'Disqualified' : s.verdict}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-black text-sm text-[#1d1d1f]">
                        {s.cts.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono">{s.meterScores[0]?.rawAverage.toFixed(2)}</td>
                      <td className="py-3.5 px-2 text-center font-mono">{s.meterScores[1]?.rawAverage.toFixed(2)}</td>
                      <td className="py-3.5 px-2 text-center font-mono">{s.meterScores[2]?.rawAverage.toFixed(2)}</td>
                      <td className="py-3.5 px-2 text-center font-mono">{s.meterScores[3]?.rawAverage.toFixed(2)}</td>
                      <td className="py-3.5 px-2 text-center font-mono">{s.meterScores[4]?.rawAverage.toFixed(2)}</td>
                      <td className="py-3.5 px-2 text-center font-mono">{s.meterScores[5]?.rawAverage.toFixed(2)}</td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => {
                            onSelectTitle(item.title.id);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-2.5 py-1.5 font-bold text-[#0071e3] hover:bg-blue-100 transition-colors cursor-pointer text-xs"
                        >
                          <span>Evaluate</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/[0.06] bg-[#fbfbfd] px-6 py-3.5 text-xs text-slate-500">
          <span>Formula: CTS = (M₁×0.2) + (M₂×0.2) + (M₃×0.2) + (M₄×0.15) + (M₅×0.15) + (M₆×0.10)</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-[#1d1d1f] px-5 py-2 font-semibold text-white hover:bg-black transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
