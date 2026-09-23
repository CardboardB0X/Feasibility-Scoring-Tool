import React, { useState, useEffect } from 'react';
import { CapstoneTitle, Researcher, LikertPoint } from '../types/scoring';
import { QUESTIONS } from '../data/rubric';
import { QuestionFlashcard } from '../components/QuestionFlashcard';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Trophy,
  LayoutGrid,
  Layers,
  Bookmark
} from 'lucide-react';
import clsx from 'clsx';

interface QuestionnairePageProps {
  titles: CapstoneTitle[];
  activeTitleId: string;
  onSelectTitle: (id: string) => void;
  researchers: Researcher[];
  activeResearcherId: string;
  onScoreChange: (questionId: string, point: LikertPoint) => void;
  onNavigate: (page: any) => void;
  onSelectTitleToViewResults: (titleId: string) => void;
}

export const QuestionnairePage: React.FC<QuestionnairePageProps> = ({
  titles,
  activeTitleId,
  onSelectTitle,
  researchers,
  activeResearcherId,
  onScoreChange,
  onNavigate,
  onSelectTitleToViewResults
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

  const activeTitle = titles.find((t) => t.id === activeTitleId) || titles[0];
  const activeTitleIndex = titles.findIndex((t) => t.id === activeTitleId);

  const currentScores =
    activeResearcherId === 'ALL_AGGREGATED'
      ? {}
      : activeTitle?.evaluations?.[activeResearcherId] || {};

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const answeredCount = Object.keys(currentScores).length;
  const isAllAnswered = answeredCount === QUESTIONS.length;
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  // Trigger celebration confetti when opening completion modal
  useEffect(() => {
    if (isCompletionModalOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [isCompletionModalOpen]);

  // Keyboard shortcut listener (1-5 for options, Left/Right arrow for nav)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const point = parseInt(e.key, 10) as LikertPoint;
        handleScoreSelect(point);
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
          setSlideDirection('next');
          setCurrentQuestionIndex((prev) => prev + 1);
        } else if (isAllAnswered) {
          setIsCompletionModalOpen(true);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentQuestionIndex > 0) {
          setSlideDirection('prev');
          setCurrentQuestionIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, currentQuestion.id, isAllAnswered]);

  const handleScoreSelect = (point: LikertPoint) => {
    onScoreChange(currentQuestion.id, point);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setTimeout(() => {
        setSlideDirection('next');
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 280);
    } else {
      setTimeout(() => {
        setIsCompletionModalOpen(true);
      }, 350);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setSlideDirection('next');
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestionIndex > 0) {
      setSlideDirection('prev');
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    setSlideDirection(index >= currentQuestionIndex ? 'next' : 'prev');
    setCurrentQuestionIndex(index);
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleNextTitle = () => {
    setIsCompletionModalOpen(false);
    const nextIdx = (activeTitleIndex + 1) % titles.length;
    onSelectTitle(titles[nextIdx].id);
    setSlideDirection('next');
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] pb-24 px-4 sm:px-6 max-w-5xl mx-auto pt-4 selection:bg-[#0071e3] selection:text-white">
      {/* Top Bar: Back, Active Title Switcher, and Overall Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0071e3] transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Title Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Candidate Title:
          </span>
          <select
            value={activeTitle.id}
            onChange={(e) => {
              onSelectTitle(e.target.value);
              setCurrentQuestionIndex(0);
            }}
            className="rounded-xl border border-black/[0.1] bg-white px-3 py-1.5 text-xs font-bold text-[#1d1d1f] shadow-2xs focus:border-[#0071e3] focus:outline-none cursor-pointer max-w-[240px] truncate"
          >
            {titles.map((t, idx) => (
              <option key={t.id} value={t.id}>
                #{idx + 1}: {t.title.trim() ? t.title.slice(0, 30) : `Untitled Title ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quizizz Progress Bar & Question Jump Matrix */}
      <div className="mb-6 rounded-[24px] border border-black/[0.08] bg-white/95 backdrop-blur-xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#1d1d1f]">
              Question {currentQuestionIndex + 1} of {QUESTIONS.length}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-500 font-medium">
              {answeredCount} of {QUESTIONS.length} answered ({progressPercent}%)
            </span>
          </div>

          {isAllAnswered && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" />
              <span>All Questions Answered</span>
            </span>
          )}
        </div>

        {/* Top Progress Bar */}
        <div className="h-2 w-full rounded-full bg-black/[0.05] overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-[#0071e3] transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* 18-Question Jump Matrix (Pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {QUESTIONS.map((q, idx) => {
            const isCurrent = currentQuestionIndex === idx;
            const isAnswered = currentScores[q.id] !== undefined;
            const isFlagged = flaggedQuestions[q.id];

            return (
              <button
                key={q.id}
                onClick={() => jumpToQuestion(idx)}
                title={`Jump to Q${idx + 1}: ${q.text.slice(0, 40)}...`}
                className={clsx(
                  "relative flex-1 min-w-[28px] sm:min-w-[34px] h-8 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center",
                  isCurrent
                    ? "bg-[#0071e3] text-white shadow-xs scale-105"
                    : isAnswered
                    ? "bg-blue-100/80 text-[#0071e3] hover:bg-blue-200/80"
                    : "bg-black/[0.04] text-slate-500 hover:bg-black/[0.08]"
                )}
              >
                <span>{idx + 1}</span>
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* FLASHCARD QUESTION CARD (Zero graphs, zero spoilers) */}
      <QuestionFlashcard
        question={currentQuestion}
        currentIndex={currentQuestionIndex}
        totalQuestions={QUESTIONS.length}
        currentScore={currentScores[currentQuestion.id]}
        isFlagged={flaggedQuestions[currentQuestion.id]}
        direction={slideDirection}
        onSelectScore={handleScoreSelect}
        onToggleFlag={() => toggleFlag(currentQuestion.id)}
        readOnly={activeResearcherId === 'ALL_AGGREGATED'}
      />

      {/* Bottom Navigation Dock */}
      <div className="mt-8 flex items-center justify-between gap-4 max-w-3xl mx-auto">
        <button
          type="button"
          disabled={currentQuestionIndex === 0}
          onClick={goToPrev}
          className="min-h-[48px] px-5 flex items-center gap-2 rounded-2xl border border-black/[0.1] bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous Question</span>
        </button>

        {isAllAnswered ? (
          <button
            type="button"
            onClick={() => setIsCompletionModalOpen(true)}
            className="min-h-[48px] px-6 flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Finish & View Outcomes</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={currentQuestionIndex === QUESTIONS.length - 1}
            onClick={goToNext}
            className="min-h-[48px] px-6 flex items-center gap-2 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-bold text-white shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next Question</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Completion & Outcomes Modal */}
      {isCompletionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in">
          <div className="relative flex flex-col w-full max-w-md rounded-[32px] bg-white p-7 shadow-2xl border border-black/[0.08] apple-spring text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#1d1d1f] tracking-tight">
                Evaluation Completed!
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                You have answered all 18 criteria for <strong>"{activeTitle.title}"</strong>.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setIsCompletionModalOpen(false);
                  onSelectTitleToViewResults(activeTitle.id);
                }}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl bg-[#0071e3] text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-[#0077ed] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Trophy className="h-4 w-4 text-amber-300" />
                <span>View Results & Feasibility Analysis</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {titles.length > 1 && (
                <button
                  onClick={handleNextTitle}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl border border-black/[0.1] bg-[#fbfbfd] text-xs font-bold text-slate-800 hover:bg-white active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
                >
                  <Layers className="h-4 w-4 text-[#0071e3]" />
                  <span>Evaluate Next Candidate Title ({((activeTitleIndex + 1) % titles.length) + 1} of {titles.length})</span>
                </button>
              )}

              <button
                onClick={() => setIsCompletionModalOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center rounded-2xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Review My Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
