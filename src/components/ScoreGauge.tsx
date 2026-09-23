import React, { useEffect, useRef } from 'react';
import { EvaluationSummary } from '../types/scoring';
import { Award, AlertTriangle, XCircle, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import clsx from 'clsx';

interface ScoreGaugeProps {
  summary: EvaluationSummary;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ summary }) => {
  const previousVerdict = useRef<string | null>(null);

  useEffect(() => {
    if (
      summary.verdict === 'Approved Finalist' &&
      summary.isComplete &&
      previousVerdict.current !== 'Approved Finalist'
    ) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    previousVerdict.current = summary.verdict;
  }, [summary.verdict, summary.isComplete]);

  const getVerdictDetails = () => {
    if (summary.isRedLineTriggered) {
      return {
        badge: 'Disqualified',
        title: 'The Red Line Triggered',
        description: 'Critical blocker on Q1, Q4, or Q5. Title cannot proceed.',
        bg: 'bg-[#ff3b30]',
        text: 'text-[#ff3b30]',
        cardBg: 'from-red-500/10 to-rose-500/5',
        border: 'border-red-500/30',
        icon: ShieldAlert
      };
    }

    switch (summary.verdict) {
      case 'Approved Finalist':
        return {
          badge: 'Approved Finalist',
          title: 'Ready for Adviser Endorsement',
          description: 'High defensibility, solid feasibility, and clear validation metrics.',
          bg: 'bg-[#34c759]',
          text: 'text-[#34c759]',
          cardBg: 'from-emerald-500/10 to-teal-500/5',
          border: 'border-emerald-500/30',
          icon: Award
        };
      case 'Conditional Backup':
        return {
          badge: 'Conditional Backup',
          title: 'Requires Scope Delimitation',
          description: 'Passable feasibility, but risky dependencies must be isolated.',
          bg: 'bg-[#ff9500]',
          text: 'text-[#ff9500]',
          cardBg: 'from-amber-500/10 to-yellow-500/5',
          border: 'border-amber-500/30',
          icon: AlertTriangle
        };
      case 'Discarded':
      default:
        return {
          badge: 'Discarded',
          title: 'Below 3.30 Threshold',
          description: 'Project is either too basic (CRUD) or lacks technical depth.',
          bg: 'bg-[#8e8e93]',
          text: 'text-[#8e8e93]',
          cardBg: 'from-slate-500/10 to-slate-500/5',
          border: 'border-slate-500/20',
          icon: XCircle
        };
    }
  };

  const details = getVerdictDetails();
  const Icon = details.icon;

  const METER_COLORS = [
    'bg-[#0071e3]', // M1 blue
    'bg-[#5856d6]', // M2 purple
    'bg-[#af52de]', // M3 violet
    'bg-[#ff9500]', // M4 orange
    'bg-[#34c759]', // M5 green
    'bg-[#00c7be]'  // M6 teal
  ];

  return (
    <div className="rounded-[28px] border border-black/[0.08] bg-white/95 backdrop-blur-xl p-6 shadow-xl shadow-black/[0.02] sticky top-20 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-black/[0.06] pb-3.5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Real-Time Metric
          </span>
          <h3 className="text-base font-extrabold text-[#1d1d1f] tracking-tight">
            Composite Score (CTS)
          </h3>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          <span>{summary.answeredCount}/{summary.totalQuestions} answered</span>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className={clsx(
        "mt-4 rounded-2xl border p-5 bg-gradient-to-br transition-all",
        details.cardBg,
        details.border
      )}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-extrabold tracking-tight text-[#1d1d1f] font-mono flex items-baseline gap-1">
              {summary.cts.toFixed(2)}
              <span className="text-base font-normal text-slate-400">/ 5.00</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className={clsx(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase text-white shadow-2xs",
                details.bg
              )}>
                <Icon className="h-3 w-3" />
                {details.badge}
              </span>
            </div>
          </div>

          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white shadow-sm border border-black/[0.04]">
            {summary.verdict === 'Approved Finalist' ? (
              <Sparkles className="h-6 w-6 text-[#34c759]" />
            ) : summary.isRedLineTriggered ? (
              <ShieldAlert className="h-6 w-6 text-[#ff3b30] animate-bounce" />
            ) : (
              <TrendingUp className="h-6 w-6 text-[#0071e3]" />
            )}
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-700 font-medium">
          {details.description}
        </p>

        {/* Apple-style threshold scale */}
        <div className="mt-4 pt-3 border-t border-black/[0.06]">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
            <span>Discarded (&lt; 3.30)</span>
            <span>Conditional (3.30–3.99)</span>
            <span>Approved (≥ 4.00)</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-black/5">
            <div className="absolute inset-y-0 left-0 w-[66%] bg-rose-200/60" />
            <div className="absolute inset-y-0 left-[66%] w-[14%] bg-amber-200/60" />
            <div className="absolute inset-y-0 left-[80%] right-0 bg-emerald-200/60" />

            <div
              className={clsx(
                "absolute inset-y-0 left-0 transition-all duration-500 rounded-full",
                details.bg
              )}
              style={{ width: `${Math.min(100, Math.max(0, (summary.cts / 5) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 6 Meters Breakdown */}
      <div className="mt-5 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span>6 Feasibility Meters</span>
          <span>Score / Wt</span>
        </div>

        {summary.meterScores.map((m, idx) => {
          const percentage = (m.rawAverage / 5) * 100;
          const colorClass = METER_COLORS[idx] || 'bg-[#0071e3]';

          return (
            <div key={m.meterId} className="group rounded-xl p-1.5 hover:bg-black/[0.02] transition-colors">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-black/5 text-slate-600 font-bold">
                    M{m.meterId}
                  </span>
                  <span className="truncate max-w-[140px] text-[11px]">{m.shortName}</span>
                </span>
                <span className="font-mono font-bold text-[#1d1d1f] text-xs">
                  {m.rawAverage > 0 ? m.rawAverage.toFixed(2) : '—'}
                  <span className="text-[10px] font-normal text-slate-400 ml-1">
                    ({m.weightPercent}%)
                  </span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                <div
                  className={clsx("h-full rounded-full transition-all duration-300", colorClass)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
