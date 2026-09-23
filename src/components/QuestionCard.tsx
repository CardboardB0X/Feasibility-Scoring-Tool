import React, { useState } from 'react';
import { Question, LikertPoint } from '../types/scoring';
import { HelpCircle, Check } from 'lucide-react';
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
  const [showCriteriaDetail, setShowCriteriaDetail] = useState(false);

  return (
    <div
      id={`question-${question.id}`}
      className={clsx(
        "rounded-2xl border p-4 sm:p-5 transition-all duration-200 bg-white shadow-xs",
        question.isRedLineQuestion
          ? "border-amber-200/80 hover:border-amber-300"
          : "border-black/[0.06] hover:border-black/[0.12]",
        currentValue !== undefined && "ring-1 ring-black/[0.04]"
      )}
    >
      {/* Minimal Question Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5">
          <span
            className={clsx(
              "flex h-6 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold font-mono tracking-tight",
              question.isRedLineQuestion
                ? "bg-amber-100 text-amber-900 border border-amber-300/80"
                : "bg-blue-50 text-[#0071e3] border border-blue-200/80"
            )}
          >
            {question.id}
          </span>
          <h4 className="text-sm sm:text-[15px] font-bold text-[#1d1d1f] leading-snug tracking-tight">
            {question.text}
          </h4>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Subtle info toggle */}
          <button
            type="button"
            onClick={() => setShowCriteriaDetail(!showCriteriaDetail)}
            title="Toggle rubric criteria explanation"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Answered indicator badge */}
          {currentValue !== undefined ? (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#0071e3] border border-blue-200/60 font-mono">
              <Check className="h-3 w-3" />
              {currentValue}
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-slate-400">
              Select
            </span>
          )}
        </div>
      </div>

      {/* Discrete Radio Options (Clean Minimalist List) */}
      <fieldset className="space-y-1.5" role="radiogroup" aria-label={question.text}>
        {question.options.map((option) => {
          const isSelected = currentValue === option.point;
          const isRedLineWarning = option.isRedLineTrigger;

          return (
            <label
              key={option.point}
              className={clsx(
                "group relative flex min-h-[48px] cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-xs sm:text-sm transition-all select-none",
                readOnly && "pointer-events-none opacity-80",
                isSelected
                  ? isRedLineWarning
                    ? "border-red-500 bg-red-50 text-red-950 ring-2 ring-red-500/20 font-semibold shadow-2xs"
                    : "border-[#0071e3] bg-blue-50/80 text-blue-950 ring-2 ring-[#0071e3]/20 font-semibold shadow-2xs"
                  : "border-black/[0.05] bg-[#fbfbfd] hover:border-black/[0.12] hover:bg-slate-50 text-slate-700"
              )}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name={question.id}
                  value={option.point}
                  checked={isSelected}
                  onChange={() => onChange(question.id, option.point)}
                  disabled={readOnly}
                  className="h-4 w-4 cursor-pointer accent-[#0071e3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]"
                />

                <span className="leading-snug">
                  <span className="font-mono font-bold mr-1.5 opacity-60">[{option.point}]</span>
                  <span>{option.description || option.label}</span>
                </span>
              </div>

              {/* Minimal Red Line chip only if triggered and selected */}
              {isRedLineWarning && isSelected && (
                <span className="shrink-0 ml-2 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-black uppercase text-white shadow-2xs">
                  Red Line
                </span>
              )}
            </label>
          );
        })}
      </fieldset>

      {/* Optional detail criteria accordion if toggled */}
      {showCriteriaDetail && question.redLineWarning && (
        <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-snug">
          <strong>Note:</strong> {question.redLineWarning}
        </div>
      )}
    </div>
  );
};
