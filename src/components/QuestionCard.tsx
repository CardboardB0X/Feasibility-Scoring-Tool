import React from 'react';
import { Question, LikertPoint } from '../types/scoring';
import { AlertTriangle, CheckCircle2, ShieldAlert, Check } from 'lucide-react';
import clsx from 'clsx';

interface QuestionCardProps {
  question: Question;
  currentValue?: LikertPoint;
  onChange: (questionId: string, point: LikertPoint) => void;
  readOnly?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentValue,
  onChange,
  readOnly = false
}) => {
  return (
    <div
      id={`question-${question.id}`}
      className={clsx(
        "rounded-[22px] border p-5 transition-all duration-200 bg-white",
        question.isRedLineQuestion
          ? "border-amber-500/30 hover:border-amber-500/50 shadow-xs"
          : "border-black/[0.07] hover:border-black/[0.12] shadow-xs",
        currentValue !== undefined && "ring-1 ring-black/[0.04]"
      )}
    >
      {/* Question Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <span
            className={clsx(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black tracking-tight",
              question.isRedLineQuestion
                ? "bg-amber-50 text-amber-900 border border-amber-300"
                : "bg-blue-50 text-[#0071e3] border border-blue-200"
            )}
          >
            {question.id}
          </span>
          <div>
            <h4 className="text-[15px] font-bold text-[#1d1d1f] leading-snug tracking-tight">
              {question.text}
            </h4>
            {question.isRedLineQuestion && (
              <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-amber-700">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Critical Red Line Question (Score [1] drops the project immediately)</span>
              </div>
            )}
          </div>
        </div>

        {currentValue !== undefined ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#0071e3] border border-blue-200/80">
            <Check className="h-3 w-3" />
            {currentValue} pt{currentValue > 1 ? 's' : ''}
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-slate-500">
            Unanswered
          </span>
        )}
      </div>

      {/* Apple-style Radio Selection List */}
      <fieldset className="space-y-2" role="radiogroup" aria-label={question.text}>
        {question.options.map((option) => {
          const isSelected = currentValue === option.point;
          const isRedLineWarning = option.isRedLineTrigger;

          return (
            <label
              key={option.point}
              className={clsx(
                "group relative flex min-h-[50px] cursor-pointer items-center justify-between rounded-xl border p-3 text-sm transition-all select-none",
                readOnly && "pointer-events-none opacity-80",
                isSelected
                  ? isRedLineWarning
                    ? "border-red-500/80 bg-red-50/80 text-red-950 ring-2 ring-red-500/25 shadow-xs"
                    : "border-[#0071e3] bg-blue-50/70 text-blue-950 ring-2 ring-[#0071e3]/20 shadow-xs"
                  : isRedLineWarning
                  ? "border-red-200/70 bg-red-50/20 hover:border-red-300 hover:bg-red-50/50"
                  : "border-black/[0.06] bg-[#fbfbfd] hover:border-black/[0.12] hover:bg-slate-50"
              )}
            >
              <div className="flex items-start gap-3 pr-2">
                <div className="relative flex items-center pt-0.5">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.point}
                    checked={isSelected}
                    onChange={() => onChange(question.id, option.point)}
                    disabled={readOnly}
                    className="h-4 w-4 cursor-pointer accent-[#0071e3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={clsx(
                        "font-extrabold text-xs px-2 py-0.5 rounded-md tracking-tight",
                        isSelected
                          ? isRedLineWarning
                            ? "bg-red-200/90 text-red-950"
                            : "bg-[#0071e3]/15 text-[#0071e3]"
                          : "bg-black/[0.06] text-slate-700"
                      )}
                    >
                      [{option.point}] {option.label}
                    </span>

                    {isRedLineWarning && (
                      <span className="inline-flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-black uppercase text-white shadow-2xs">
                        <AlertTriangle className="h-2.5 w-2.5" />
                        Red Line Trigger
                      </span>
                    )}
                  </div>

                  <span
                    className={clsx(
                      "mt-1 text-xs leading-relaxed",
                      isSelected
                        ? isRedLineWarning
                          ? "text-red-900 font-semibold"
                          : "text-blue-950 font-medium"
                        : "text-slate-600"
                    )}
                  >
                    {option.description}
                  </span>
                </div>
              </div>

              {/* Point badge */}
              <div
                className={clsx(
                  "hidden sm:flex shrink-0 h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-bold transition-colors",
                  isSelected
                    ? isRedLineWarning
                      ? "bg-red-600 text-white"
                      : "bg-[#0071e3] text-white"
                    : "bg-black/5 text-slate-500 group-hover:bg-black/10"
                )}
              >
                {option.point}
              </div>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
};
