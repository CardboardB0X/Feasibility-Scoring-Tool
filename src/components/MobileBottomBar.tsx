import React from 'react';
import { EvaluationSummary } from '../types/scoring';
import { Trophy, FileText, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

interface MobileBottomBarProps {
  summary: EvaluationSummary;
  onOpenLeaderboard: () => void;
  onOpenReport: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  summary,
  onOpenLeaderboard,
  onOpenReport
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden p-3 bg-white/90 backdrop-blur-xl border-t border-black/[0.08] shadow-lg">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        {/* Score & Verdict Pill */}
        <div className="flex items-center gap-2.5">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
              CTS
            </div>
            <div className="font-mono font-black text-lg text-[#1d1d1f] leading-tight">
              {summary.cts.toFixed(2)}
            </div>
          </div>

          <span
            className={clsx(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase text-white shadow-2xs",
              summary.isRedLineTriggered
                ? "bg-[#ff3b30]"
                : summary.verdict === 'Approved Finalist'
                ? "bg-[#34c759]"
                : summary.verdict === 'Conditional Backup'
                ? "bg-[#ff9500]"
                : "bg-slate-500"
            )}
          >
            {summary.isRedLineTriggered ? (
              <>
                <ShieldAlert className="h-3 w-3" />
                <span>Red Line</span>
              </>
            ) : (
              <span>{summary.verdict}</span>
            )}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1 rounded-xl bg-[#1d1d1f] px-3 py-2 text-xs font-semibold text-white active:scale-95 transition-transform"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>Matrix</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1 rounded-xl border border-[#0071e3]/30 bg-blue-50 px-3 py-2 text-xs font-semibold text-[#0071e3] active:scale-95 transition-transform"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
