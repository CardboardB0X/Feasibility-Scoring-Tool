import React from 'react';
import { Question, LikertPoint } from '../types/scoring';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
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
        "rounded-2xl border p-5 transition-all duration-200 bg-white shadow-xs",
        question.isRedLineQuestion
          ? "border-amber-200 hover:border-amber-300"
          : "border-slate-200 hover:border-slate-300",
        currentValue !== undefined && "ring-1 ring-slate-200"
      )}
    >
      {/* Question Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <span
            className={clsx(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black tracking-wide",
              question.isRedLineQuestion
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : "bg-blue-100 text-blue-900 border border-blue-200"
            )}
          >
            {question.id}
          </span>
          <div>
            <h4 className="text-base font-bold text-slate-900 leading-snug">
              {question.text}
            </h4>
            {question.isRedLineQuestion && (
              <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-amber-700">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Critical Red Line Question (Score of [1] causes immediate disqualification)</span>
              </div>
            )}
          </div>
        </div>

        {currentValue !== undefined ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
            {currentValue} pt{currentValue > 1 ? 's' : ''}
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            Required
          </span>
        )}
      </div>

      {/* Discrete Radio Cards */}
      <fieldset className="space-y-2.5" role="radiogroup" aria-label={question.text}>
        {question.options.map((option) => {
          const isSelected = currentValue === option.point;
          const isRedLineWarning = option.isRedLineTrigger;

          return (
            <label
              key={option.point}
              className={clsx(
                "group relative flex min-h-[52px] cursor-pointer items-center justify-between rounded-xl border p-3.5 text-sm transition-all select-none",
                readOnly && "pointer-events-none opacity-80",
                isSelected
                  ? isRedLineWarning
                    ? "border-red-500 bg-red-50/80 text-red-950 ring-2 ring-red-500/30"
                    : "border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600/20 shadow-xs"
                  : isRedLineWarning
                  ? "border-red-200/80 bg-red-50/30 hover:border-red-300 hover:bg-red-50/60"
                  : "border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-100/60"
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
                    className="h-4 w-4 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={clsx(
                        "font-bold text-xs px-2 py-0.5 rounded-md",
                        isSelected
                          ? isRedLineWarning
                            ? "bg-red-200 text-red-900"
                            : "bg-blue-200 text-blue-950"
                          : "bg-slate-200 text-slate-700"
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
                          ? "text-red-900 font-medium"
                          : "text-blue-900 font-medium"
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
                  "hidden sm:flex shrink-0 h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold",
                  isSelected
                    ? isRedLineWarning
                      ? "bg-red-600 text-white"
                      : "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
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
