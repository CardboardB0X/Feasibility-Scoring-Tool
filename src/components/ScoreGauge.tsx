import React, { useEffect, useRef } from 'react';
import { EvaluationSummary } from '../types/scoring';
import { Award, AlertTriangle, XCircle, CheckCircle, ShieldAlert, Sparkles, TrendingUp, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import clsx from 'clsx';

interface ScoreGaugeProps {
  summary: EvaluationSummary;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ summary }) => {
  const previousVerdict = useRef<string | null>(null);

  // Trigger celebration confetti when title reaches "Approved Finalist"
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

  // Color mappings
  const getVerdictDetails = () => {
    if (summary.isRedLineTriggered) {
      return {
        badge: 'Disqualified',
        title: 'The Red Line Triggered',
        description: 'Dropped immediately due to unresolvable blocker (Q1, Q4, or Q5 score of 1).',
        bg: 'bg-red-600',
        text: 'text-red-700',
        cardBg: 'from-red-500/10 to-rose-500/5',
        border: 'border-red-300',
        icon: ShieldAlert
      };
    }

    switch (summary.verdict) {
      case 'Approved Finalist':
        return {
          badge: 'Approved Finalist',
          title: 'Ready for Adviser Presentation',
          description: 'High defensibility, solid technical feasibility, and strong empirical rigor.',
          bg: 'bg-emerald-600',
          text: 'text-emerald-700',
          cardBg: 'from-emerald-500/10 to-teal-500/5',
          border: 'border-emerald-300',
          icon: Award
        };
      case 'Conditional Backup':
        return {
          badge: 'Conditional Backup',
          title: 'Requires Cutting Risky Modules',
          description: 'Passable feasibility, but scope creep, data access, or complexity needs delimitation.',
          bg: 'bg-amber-500',
          text: 'text-amber-700',
          cardBg: 'from-amber-500/10 to-yellow-500/5',
          border: 'border-amber-300',
          icon: AlertTriangle
        };
      case 'Discarded':
      default:
        return {
          badge: 'Discarded',
          title: 'Insufficient Feasibility / Depth',
          description: 'Score falls below 3.30. Project is either too basic (CRUD) or excessively fragile.',
          bg: 'bg-rose-600',
          text: 'text-rose-700',
          cardBg: 'from-rose-500/10 to-slate-500/5',
          border: 'border-rose-300',
          icon: XCircle
        };
    }
  };

  const details = getVerdictDetails();
  const Icon = details.icon;

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-lg shadow-slate-900/5 sticky top-24">
      {/* Header & Status */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Real-Time Assessment
          </span>
          <h3 className="text-lg font-black text-slate-900">
            Composite Score (CTS)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          <span>{summary.answeredCount}/{summary.totalQuestions} answered</span>
        </div>
      </div>

      {/* Main Score Hero */}
      <div className={clsx(
        "mt-4 rounded-2xl border p-5 bg-gradient-to-br transition-all",
        details.cardBg,
        details.border
      )}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-black tracking-tight text-slate-950 font-mono flex items-baseline gap-1">
              {summary.cts.toFixed(2)}
              <span className="text-lg font-medium text-slate-500">/ 5.00</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className={clsx(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black uppercase text-white shadow-xs",
                details.bg
              )}>
                <Icon className="h-3 w-3" />
                {details.badge}
              </span>
            </div>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md text-slate-800">
            {summary.verdict === 'Approved Finalist' ? (
              <Sparkles className="h-7 w-7 text-emerald-500" />
            ) : summary.isRedLineTriggered ? (
              <ShieldAlert className="h-7 w-7 text-red-600 animate-bounce" />
            ) : (
              <TrendingUp className="h-7 w-7 text-blue-600" />
            )}
          </div>
        </div>

        <div className="mt-3 text-xs leading-relaxed text-slate-700 font-medium">
          {details.description}
        </div>

        {/* Threshold bar */}
        <div className="mt-4 pt-3 border-t border-slate-200/60">
          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
            <span>Discarded (&lt; 3.30)</span>
            <span>Conditional (3.30–3.99)</span>
            <span>Approved (&ge; 4.00)</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
            {/* Visual zones */}
            <div className="absolute inset-y-0 left-0 w-[66%] bg-rose-200 opacity-60"></div>
            <div className="absolute inset-y-0 left-[66%] w-[14%] bg-amber-200 opacity-60"></div>
            <div className="absolute inset-y-0 left-[80%] right-0 bg-emerald-200 opacity-60"></div>

            {/* Current score fill */}
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

      {/* Meter Breakdown List */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>6 Evaluation Meters</span>
          <span>Avg / Weight</span>
        </div>

        {summary.meterScores.map((m) => {
          const percentage = (m.rawAverage / 5) * 100;
          return (
            <div key={m.meterId} className="group rounded-xl p-2 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                    M{m.meterId}
                  </span>
                  <span className="truncate max-w-[150px]">{m.shortName}</span>
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {m.rawAverage > 0 ? m.rawAverage.toFixed(2) : '—'}
                  <span className="text-[10px] font-normal text-slate-400 ml-1">
                    ({m.weightPercent}%)
                  </span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={clsx(
                    "h-full rounded-full transition-all duration-300",
                    m.rawAverage >= 4.0
                      ? "bg-emerald-500"
                      : m.rawAverage >= 3.0
                      ? "bg-blue-500"
                      : m.rawAverage > 0
                      ? "bg-amber-500"
                      : "bg-slate-300"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Mathematical Formula Footnote */}
      <div className="mt-6 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 border border-slate-200/60">
        <div className="flex items-center gap-1 font-bold text-slate-700 mb-1">
          <Info className="h-3.5 w-3.5 text-blue-500" />
          Official CTS Formula:
        </div>
        <div className="font-mono text-[10px] text-slate-600 leading-tight">
          CTS = (M₁×0.20) + (M₂×0.20) + (M₃×0.20) + (M₄×0.15) + (M₅×0.15) + (M₆×0.10)
        </div>
      </div>
    </div>
  );
};
