import React, { useState } from 'react';
import { Question, LikertPoint } from '../types/scoring';
import { MASTER_LIKERT_ANCHORS } from '../data/rubric';
import { Check, Bookmark, Sparkles, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface QuestionFlashcardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  currentScore?: LikertPoint;
  isFlagged?: boolean;
  direction?: 'next' | 'prev';
  onSelectScore: (score: LikertPoint) => void;
  onToggleFlag?: () => void;
  readOnly?: boolean;
}

const OPTION_THEMES: Record<
  number,
  {
    selectedCard: string;
    badgeSelected: string;
    titleSelected: string;
    indicatorSelected: string;
    popClass: string;
  }
> = {
  1: {
    selectedCard:
      'border-rose-500 bg-gradient-to-r from-rose-50/90 to-rose-50/40 text-[#1d1d1f] shadow-md shadow-rose-500/15 ring-2 ring-rose-500/20',
    badgeSelected: 'bg-rose-500 text-white shadow-xs scale-105',
    titleSelected: 'text-rose-600',
    indicatorSelected: 'border-rose-500 bg-rose-500 text-white scale-105',
    popClass: 'animate-option-pop-1'
  },
  2: {
    selectedCard:
      'border-orange-500 bg-gradient-to-r from-orange-50/90 to-orange-50/40 text-[#1d1d1f] shadow-md shadow-orange-500/15 ring-2 ring-orange-500/20',
    badgeSelected: 'bg-orange-500 text-white shadow-xs scale-105',
    titleSelected: 'text-orange-600',
    indicatorSelected: 'border-orange-500 bg-orange-500 text-white scale-105',
    popClass: 'animate-option-pop-2'
  },
  3: {
    selectedCard:
      'border-amber-500 bg-gradient-to-r from-amber-50/90 to-amber-50/40 text-[#1d1d1f] shadow-md shadow-amber-500/15 ring-2 ring-amber-500/20',
    badgeSelected: 'bg-amber-500 text-white shadow-xs scale-105',
    titleSelected: 'text-amber-700',
    indicatorSelected: 'border-amber-500 bg-amber-500 text-white scale-105',
    popClass: 'animate-option-pop-3'
  },
  4: {
    selectedCard:
      'border-emerald-500 bg-gradient-to-r from-emerald-50/90 to-emerald-50/40 text-[#1d1d1f] shadow-md shadow-emerald-500/15 ring-2 ring-emerald-500/20',
    badgeSelected: 'bg-emerald-500 text-white shadow-xs scale-105',
    titleSelected: 'text-emerald-600',
    indicatorSelected: 'border-emerald-500 bg-emerald-500 text-white scale-105',
    popClass: 'animate-option-pop-4'
  },
  5: {
    selectedCard:
      'border-indigo-600 bg-gradient-to-r from-indigo-50/90 to-indigo-50/40 text-[#1d1d1f] shadow-md shadow-indigo-500/15 ring-2 ring-indigo-500/20',
    badgeSelected: 'bg-indigo-600 text-white shadow-xs scale-105',
    titleSelected: 'text-indigo-600',
    indicatorSelected: 'border-indigo-600 bg-indigo-600 text-white scale-105',
    popClass: 'animate-option-pop-5'
  }
};

export const QuestionFlashcard: React.FC<QuestionFlashcardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  currentScore,
  isFlagged = false,
  direction = 'next',
  onSelectScore,
  onToggleFlag,
  readOnly = false
}) => {
  const [poppedPoint, setPoppedPoint] = useState<number | null>(null);

  const handleChoiceClick = (point: LikertPoint) => {
    if (readOnly) return;
    setPoppedPoint(point);
    setTimeout(() => setPoppedPoint(null), 300);
    onSelectScore(point);
  };

  return (
    <div
      key={`${question.id}-${currentIndex}`}
      className={clsx(
        "relative flex flex-col rounded-[32px] bg-white/95 backdrop-blur-2xl border border-black/[0.08] shadow-2xl p-6 sm:p-10 transition-all max-w-3xl mx-auto w-full",
        direction === 'next' ? "animate-card-slide-right" : "animate-card-slide-left"
      )}
    >
      {/* Flashcard Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 px-3 py-1 font-mono text-xs font-black tracking-wide">
            QUESTION {currentIndex + 1} OF {totalQuestions}
          </span>

          <span className="rounded-full bg-black/[0.04] text-slate-600 px-3 py-1 text-xs font-semibold truncate max-w-[200px] sm:max-w-none">
            {question.meterName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {question.isRedLineQuestion && (
            <span className="rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 px-2.5 py-0.5 text-[11px] font-bold">
              Critical Anchor
            </span>
          )}

          {onToggleFlag && (
            <button
              type="button"
              onClick={onToggleFlag}
              title={isFlagged ? 'Flagged for review' : 'Flag for review'}
              className={clsx(
                "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
                isFlagged
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-black/[0.04] text-slate-400 hover:text-slate-700 hover:bg-black/[0.08]"
              )}
            >
              <Bookmark className={clsx("h-3.5 w-3.5", isFlagged && "fill-amber-500")} />
              <span className="hidden sm:inline">{isFlagged ? 'Flagged' : 'Flag'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1d1d1f] tracking-tight leading-snug">
          {question.text}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Choose the discrete choice that most accurately reflects your research team's current feasibility state.
        </p>
      </div>

      {/* Discrete 5-Choice Options (Quizizz / Flashcard Style) */}
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = currentScore === opt.point;
          const isPopped = poppedPoint === opt.point;
          const anchor = MASTER_LIKERT_ANCHORS.find((a) => a.point === opt.point);
          const theme = OPTION_THEMES[opt.point] || OPTION_THEMES[3];

          return (
            <button
              key={opt.point}
              type="button"
              disabled={readOnly}
              onClick={() => handleChoiceClick(opt.point)}
              className={clsx(
                "group relative w-full text-left rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-pointer flex items-center justify-between gap-4 active:scale-[0.98]",
                isPopped && theme.popClass,
                isSelected
                  ? theme.selectedCard
                  : "border-black/[0.07] bg-white hover:border-black/[0.18] hover:bg-[#fbfbfd]"
              )}
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                {/* Numeric Pill with Keyboard Hint */}
                <div
                  className={clsx(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-black transition-all",
                    isSelected
                      ? theme.badgeSelected
                      : "bg-black/[0.05] text-slate-700 group-hover:bg-black/[0.1]"
                  )}
                >
                  {opt.point}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={clsx(
                        "text-sm sm:text-base font-extrabold tracking-tight",
                        isSelected ? theme.titleSelected : "text-[#1d1d1f]"
                      )}
                    >
                      {anchor?.label || `Option [${opt.point}]`}
                    </span>
                    {anchor?.note && (
                      <span className="text-xs text-slate-400 font-medium">
                        ({anchor.note})
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </div>

              {/* Checkmark Indicator */}
              <div
                className={clsx(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all",
                  isSelected
                    ? theme.indicatorSelected
                    : "border-black/[0.15] bg-transparent opacity-0 group-hover:opacity-40"
                )}
              >
                {isSelected && <Check className="h-4 w-4 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Keyboard Shortcut Hint Footer */}
      <div className="mt-8 pt-4 border-t border-black/[0.05] flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline">Tip: Press keys</span>
          <kbd className="rounded border border-black/10 bg-black/[0.04] px-1.5 py-0.5 font-mono font-bold text-slate-600">1</kbd>
          <span className="hidden sm:inline">through</span>
          <kbd className="rounded border border-black/10 bg-black/[0.04] px-1.5 py-0.5 font-mono font-bold text-slate-600">5</kbd>
          <span>to select answer</span>
        </div>

        <div className="flex items-center gap-1">
          <span>Use</span>
          <kbd className="rounded border border-black/10 bg-black/[0.04] px-1.5 py-0.5 font-mono font-bold text-slate-600">&larr;</kbd>
          <kbd className="rounded border border-black/10 bg-black/[0.04] px-1.5 py-0.5 font-mono font-bold text-slate-600">&rarr;</kbd>
          <span>to navigate</span>
        </div>
      </div>
    </div>
  );
};
