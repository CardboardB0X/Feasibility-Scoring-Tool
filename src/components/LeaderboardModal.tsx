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

  // Counts
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-6xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Capstone Titles Comparison Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Evaluating {titles.length} proposed titles against the 18 closed-choice criteria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6 border-b border-slate-100 bg-slate-50/40">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-emerald-600" />
              Approved Finalists (≥ 4.00)
            </div>
            <div className="text-2xl font-black text-emerald-950 font-mono mt-1">
              {approvedCount} <span className="text-xs font-normal text-emerald-700">titles</span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              Conditional Backups (3.30–3.99)
            </div>
            <div className="text-2xl font-black text-amber-950 font-mono mt-1">
              {conditionalCount} <span className="text-xs font-normal text-amber-700">titles</span>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-3.5">
            <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
              Discarded (&lt; 3.30)
            </div>
            <div className="text-2xl font-black text-rose-950 font-mono mt-1">
              {discardedCount} <span className="text-xs font-normal text-rose-700">titles</span>
            </div>
          </div>

          <div className="rounded-2xl border border-red-300 bg-red-50/80 p-3.5">
            <div className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
              The Red Line Dropped
            </div>
            <div className="text-2xl font-black text-red-950 font-mono mt-1">
              {disqualifiedCount} <span className="text-xs font-normal text-red-700">titles</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 overflow-x-auto text-xs font-bold">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </span>
          <button
            onClick={() => setFilter('ALL')}
            className={clsx(
              "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
              filter === 'ALL' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            All ({titles.length})
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={clsx(
              "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
              filter === 'APPROVED' ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            )}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('CONDITIONAL')}
            className={clsx(
              "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
              filter === 'CONDITIONAL' ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            )}
          >
            Conditional ({conditionalCount})
          </button>
          <button
            onClick={() => setFilter('DISQUALIFIED')}
            className={clsx(
              "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
              filter === 'DISQUALIFIED' ? "bg-red-600 text-white" : "bg-red-50 text-red-800 hover:bg-red-100"
            )}
          >
            Red Line Disqualified ({disqualifiedCount})
          </button>
          <button
            onClick={() => setFilter('DISCARDED')}
            className={clsx(
              "px-3 py-1.5 rounded-lg transition-colors cursor-pointer",
              filter === 'DISCARDED' ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-800 hover:bg-rose-100"
            )}
          >
            Discarded ({discardedCount})
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-[11px] font-black uppercase tracking-wider text-slate-600 border-b border-slate-200">
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
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((item, index) => {
                  const s = item.summary;
                  const isDisqualified = s.isRedLineTriggered;

                  return (
                    <tr
                      key={item.title.id}
                      className={clsx(
                        "hover:bg-slate-50/80 transition-colors",
                        isDisqualified && "bg-red-50/30"
                      )}
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-slate-500 font-mono">
                        {isDisqualified ? '—' : `#${index + 1}`}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 leading-snug">
                          {item.title.title}
                        </div>
                        {item.title.category && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.title.category}
                          </div>
                        )}
                        {isDisqualified && s.redLineViolations.length > 0 && (
                          <div className="mt-1 text-[11px] font-bold text-red-700 flex items-center gap-1">
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
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                            isDisqualified
                              ? "bg-red-600 text-white"
                              : s.verdict === 'Approved Finalist'
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : s.verdict === 'Conditional Backup'
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-slate-200 text-slate-700"
                          )}
                        >
                          {isDisqualified ? 'Disqualified' : s.verdict}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-black text-sm text-slate-900">
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
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 font-bold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer text-xs"
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

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4 text-xs text-slate-500">
          <span>Formula: CTS = (M₁×0.2) + (M₂×0.2) + (M₃×0.2) + (M₄×0.15) + (M₅×0.15) + (M₆×0.10)</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
