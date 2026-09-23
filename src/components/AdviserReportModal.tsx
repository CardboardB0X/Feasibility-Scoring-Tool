import React from 'react';
import { CapstoneTitle, EvaluationSummary, Researcher } from '../types/scoring';
import { QUESTIONS, METERS } from '../data/rubric';
import { X, Printer, ShieldAlert, Award, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface AdviserReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: CapstoneTitle;
  summary: EvaluationSummary;
  researchers: Researcher[];
  activeResearcherId: string;
}

export const AdviserReportModal: React.FC<AdviserReportModalProps> = ({
  isOpen,
  onClose,
  title,
  summary,
  researchers,
  activeResearcherId
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const evaluatorLabel =
    activeResearcherId === 'ALL_AGGREGATED'
      ? 'Consolidated Group Consensus (All Researchers)'
      : researchers.find((r) => r.id === activeResearcherId)?.name || 'Lead Researcher';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="relative my-8 flex flex-col w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Actions bar (hidden during print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-slate-800 text-sm">
              Adviser Presentation & Defense Report
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-8 md:p-12 text-slate-900 bg-white" id="printable-adviser-report">
          {/* Institutional Header */}
          <div className="border-b-2 border-slate-900 pb-6 text-center">
            <div className="text-xs font-black tracking-widest text-slate-500 uppercase">
              Academic Capstone Feasibility & Defensibility Assessment
            </div>
            <h1 className="mt-2 text-2xl font-black text-slate-950 tracking-tight sm:text-3xl">
              CAPSTONE TITLE EVALUATION REPORT
            </h1>
            <div className="mt-2 text-xs text-slate-600">
              Evaluated on: <span className="font-semibold">{currentDate}</span> • Mode: <span className="font-semibold">{evaluatorLabel}</span>
            </div>
          </div>

          {/* Title Info Section */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <div className="text-xs font-black uppercase tracking-wider text-slate-500">
              Proposed Capstone Title:
            </div>
            <h2 className="mt-1 text-xl font-black text-slate-950 leading-snug">
              {title.title}
            </h2>
            {title.description && (
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                {title.description}
              </p>
            )}
            {title.category && (
              <div className="mt-3">
                <span className="inline-block rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-900">
                  Domain: {title.category}
                </span>
              </div>
            )}
          </div>

          {/* Assessment Verdict & CTS Hero */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Overall Composite Score (CTS)
                </span>
                <div className="mt-1 text-4xl font-black text-slate-950 font-mono flex items-baseline gap-2">
                  {summary.cts.toFixed(2)}
                  <span className="text-sm font-normal text-slate-500">/ 5.00</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                Formula: CTS = (M₁×0.2) + (M₂×0.2) + (M₃×0.2) + (M₄×0.15) + (M₅×0.15) + (M₆×0.10)
              </div>
            </div>

            <div className={clsx(
              "rounded-2xl border p-6 flex flex-col justify-between",
              summary.isRedLineTriggered
                ? "border-red-400 bg-red-50/80"
                : summary.verdict === 'Approved Finalist'
                ? "border-emerald-400 bg-emerald-50/80"
                : summary.verdict === 'Conditional Backup'
                ? "border-amber-400 bg-amber-50/80"
                : "border-slate-300 bg-slate-50"
            )}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Adviser Committee Verdict
                </span>
                <div className="mt-1 text-2xl font-black">
                  {summary.isRedLineTriggered ? (
                    <span className="text-red-700 flex items-center gap-1.5">
                      <ShieldAlert className="h-6 w-6" />
                      DISQUALIFIED (The Red Line)
                    </span>
                  ) : summary.verdict === 'Approved Finalist' ? (
                    <span className="text-emerald-800 flex items-center gap-1.5">
                      <Award className="h-6 w-6" />
                      Approved Finalist
                    </span>
                  ) : summary.verdict === 'Conditional Backup' ? (
                    <span className="text-amber-800 flex items-center gap-1.5">
                      <AlertTriangle className="h-6 w-6" />
                      Conditional Backup
                    </span>
                  ) : (
                    <span className="text-rose-800">Discarded</span>
                  )}
                </div>
              </div>

              <div className="mt-3 text-xs font-medium text-slate-800 leading-snug">
                {summary.isRedLineTriggered
                  ? "Project must not proceed. Critical blocker identified in programming skill, raw data availability, or institutional clearances."
                  : summary.verdict === 'Approved Finalist'
                  ? "Project meets all threshold standards. Recommended for immediate title submission and adviser endorsement."
                  : summary.verdict === 'Conditional Backup'
                  ? "Acceptable only as secondary backup. High-risk modules must be removed or strictly delimited in Chapter 1."
                  : "Does not meet minimum feasibility or algorithmic depth criteria. Select an alternative title."}
              </div>
            </div>
          </div>

          {/* Red Line Log if any */}
          {summary.isRedLineTriggered && (
            <div className="mt-6 rounded-2xl border-2 border-red-500 bg-red-50 p-6">
              <h3 className="text-sm font-black uppercase text-red-950 tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-red-600" />
                Red Line Disqualification Audit
              </h3>
              <div className="mt-2 space-y-2">
                {summary.redLineViolations.map((v, i) => (
                  <div key={i} className="text-xs text-red-900 bg-white/80 p-3 rounded-lg border border-red-200">
                    <span className="font-bold">{v.questionId} (Score: 1):</span> {v.blockerReason}
                    <div className="text-[11px] text-slate-500 mt-1 italic">"{v.questionText}"</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meter Breakdown Table */}
          <div className="mt-8">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 mb-3">
              Summary of 6 Evaluation Meters
            </h3>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <th className="py-2.5 px-4">Evaluation Meter</th>
                    <th className="py-2.5 px-3 text-center">Weight</th>
                    <th className="py-2.5 px-3 text-center">Average Score</th>
                    <th className="py-2.5 px-3 text-center">Weighted Contribution</th>
                    <th className="py-2.5 px-4">Defensibility Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summary.meterScores.map((m) => (
                    <tr key={m.meterId} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {m.meterName}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-600">
                        {m.weightPercent}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-black text-slate-900">
                        {m.rawAverage.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-700">
                        {m.weightedContribution.toFixed(3)}
                      </td>
                      <td className="py-3 px-4">
                        {m.rawAverage >= 4.0 ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> High Defensibility
                          </span>
                        ) : m.rawAverage >= 3.0 ? (
                          <span className="text-amber-700 font-bold">Passable with Reservations</span>
                        ) : (
                          <span className="text-rose-700 font-bold">High Friction / Risk Area</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures Section */}
          <div className="mt-16 pt-8 border-t-2 border-slate-300">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8 text-center">
              Formal Endorsement & Committee Sign-Off
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center text-xs">
              <div>
                <div className="border-b border-slate-900 pb-1 mb-1 font-bold text-slate-900">
                  {evaluatorLabel}
                </div>
                <div className="text-slate-500">Lead Researcher / Team Dev</div>
              </div>

              <div>
                <div className="border-b border-slate-900 pb-1 mb-1 font-bold text-slate-900">
                  &nbsp;
                </div>
                <div className="text-slate-500">Capstone / Thesis Adviser</div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <div className="border-b border-slate-900 pb-1 mb-1 font-bold text-slate-900">
                  &nbsp;
                </div>
                <div className="text-slate-500">Panel Committee Chair</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer (hidden during print) */}
        <div className="no-print flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <span className="text-xs text-slate-500">
            Tip: Select "Save as PDF" in your browser print dialogue.
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
