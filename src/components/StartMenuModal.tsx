import React from 'react';
import { CapstoneTitle, Researcher } from '../types/scoring';
import { calculateTitleSummary } from '../utils/calculator';
import { METERS } from '../data/rubric';
import {
  Scale,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Award,
  AlertTriangle,
  Users,
  Trophy,
  CheckCircle2,
  BookOpen,
  X,
  Play
} from 'lucide-react';
import clsx from 'clsx';

interface StartMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  titles: CapstoneTitle[];
  activeResearcherId: string;
  researchers: Researcher[];
  onSelectTitle: (id: string) => void;
  onOpenLeaderboard: () => void;
  onOpenResearcherManager: () => void;
  onLoadSampleData: () => void;
}

export const StartMenuModal: React.FC<StartMenuModalProps> = ({
  isOpen,
  onClose,
  titles,
  activeResearcherId,
  researchers,
  onSelectTitle,
  onOpenLeaderboard,
  onOpenResearcherManager,
  onLoadSampleData
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col max-h-[92vh] w-full max-w-5xl rounded-[28px] bg-white/95 backdrop-blur-2xl shadow-2xl border border-black/[0.08] overflow-hidden apple-spring">
        {/* macOS Window Title Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-black/[0.06] bg-[#fbfbfd]/80 select-none">
          {/* Traffic light dots */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:opacity-80 transition-opacity cursor-pointer"
              title="Close Start Menu"
            />
            <div className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
          </div>

          <div className="text-xs font-semibold text-slate-500 tracking-tight flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5 text-[#0071e3]" />
            <span>Capstone Title Feasibility Evaluator • Start Menu</span>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-black/5 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Hero Welcome Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-slate-50 border border-blue-500/15">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0071e3] to-[#47a3ff] text-white shadow-lg shadow-blue-500/25">
              <Scale className="h-8 w-8" />
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0071e3]/10 px-3 py-0.5 text-xs font-bold text-[#0071e3] mb-1">
                <span>Decision Support & Delimitation Framework</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
                Welcome to Capstone Evaluator
              </h1>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed max-w-2xl">
                A 100% closed-ended 18-question Likert rubric designed to test proposed capstone titles across 6 weighted feasibility meters, eliminate high-risk projects via <strong>The Red Line</strong>, and produce defensible Composite Scores (CTS).
              </p>
            </div>

            <button
              onClick={() => {
                onSelectTitle(titles[0].id);
                onClose();
              }}
              className="flex shrink-0 items-center gap-2 rounded-2xl bg-[#0071e3] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-[#0077ed] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Start Evaluating</span>
            </button>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                onSelectTitle(titles[0].id);
                onClose();
              }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs hover:border-[#0071e3]/40 hover:bg-blue-50/30 transition-all text-left group cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0071e3] group-hover:scale-105 transition-transform">
                <Play className="h-5 w-5 fill-[#0071e3]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1d1d1f]">Start with Title 1</div>
                <div className="text-[11px] text-slate-500">Answer 18 closed questions</div>
              </div>
            </button>

            <button
              onClick={() => {
                onOpenLeaderboard();
                onClose();
              }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs hover:border-amber-500/40 hover:bg-amber-50/30 transition-all text-left group cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1d1d1f]">Compare All 9 Titles</div>
                <div className="text-[11px] text-slate-500">Side-by-side leaderboard</div>
              </div>
            </button>

            <button
              onClick={() => {
                onLoadSampleData();
                onClose();
              }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs hover:border-purple-500/40 hover:bg-purple-50/30 transition-all text-left group cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1d1d1f]">Load Benchmark Sample</div>
                <div className="text-[11px] text-slate-500">Populate 9 pre-tested titles</div>
              </div>
            </button>
          </div>

          {/* Section: Select a Candidate Title */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1d1d1f] tracking-tight">
                  Candidate Capstone Titles (1 to {titles.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Select any title to view or continue its closed-choice evaluation
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                Mode: {activeResearcherId === 'ALL_AGGREGATED' ? 'Group Consensus' : 'Individual'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {titles.map((t, idx) => {
                const s = calculateTitleSummary(t, activeResearcherId, researchers);
                const isDisqualified = s.isRedLineTriggered;
                const isComplete = s.isComplete;

                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectTitle(t.id);
                      onClose();
                    }}
                    className={clsx(
                      "group flex flex-col justify-between p-4 rounded-2xl border transition-all cursor-pointer bg-white",
                      isDisqualified
                        ? "border-red-200 hover:border-red-400 hover:bg-red-50/30"
                        : s.verdict === 'Approved Finalist' && isComplete
                        ? "border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/30"
                        : "border-black/[0.07] hover:border-[#0071e3]/40 hover:bg-slate-50/60 shadow-2xs"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <span
                          className={clsx(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                            isDisqualified
                              ? "bg-red-100 text-red-700"
                              : s.verdict === 'Approved Finalist' && isComplete
                              ? "bg-emerald-100 text-emerald-800"
                              : s.verdict === 'Conditional Backup' && isComplete
                              ? "bg-amber-100 text-amber-800"
                              : s.answeredCount > 0
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {isDisqualified
                            ? '🚨 Red Line'
                            : isComplete
                            ? s.verdict
                            : `${s.answeredCount}/18 answered`}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-[#1d1d1f] line-clamp-2 leading-snug group-hover:text-[#0071e3] transition-colors">
                        {t.title}
                      </h4>
                      {t.description && (
                        <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                          {t.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-black/[0.04] flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-500">
                        CTS: <strong className="text-slate-900">{s.cts.toFixed(2)}</strong>
                      </span>
                      <span className="font-semibold text-[#0071e3] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Evaluate</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Elimination Rules & 6 Meters Quick Reference */}
          <div className="rounded-3xl border border-black/[0.06] bg-[#fbfbfd] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#0071e3]" />
              <h3 className="text-sm font-bold text-[#1d1d1f]">
                Master Scoring Scale & Elimination Rules
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* The Red Line Rule */}
              <div className="p-4 rounded-2xl bg-red-50/80 border border-red-200">
                <div className="font-bold text-red-950 flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                  Immediate Disqualification (The Red Line)
                </div>
                <p className="text-red-900/90 leading-relaxed text-[11px]">
                  If any researcher selects <strong>[1]</strong> on <strong>Q1</strong> (no programmer capability), <strong>Q4</strong> (unobtainable data), or <strong>Q5</strong> (lengthy ethics board / MOA clearance), the title is dropped immediately and must not be presented to the panel.
                </p>
              </div>

              {/* CTS Formula */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
                <div className="font-bold text-blue-950 flex items-center gap-1.5 mb-1">
                  <Award className="h-4 w-4 text-[#0071e3]" />
                  Composite Score (CTS) Thresholds
                </div>
                <ul className="text-blue-950/90 space-y-1 text-[11px]">
                  <li>• <strong>CTS ≥ 4.00:</strong> Approved Finalist (Ready for adviser endorsement)</li>
                  <li>• <strong>3.30 ≤ CTS &lt; 4.00:</strong> Conditional Backup (Cut risky modules)</li>
                  <li>• <strong>CTS &lt; 3.30:</strong> Discarded (Lacks feasibility or technical depth)</li>
                </ul>
              </div>
            </div>

            {/* 6 Meters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2">
              {METERS.map((m) => (
                <div key={m.id} className="p-2.5 rounded-xl bg-white border border-black/[0.04] text-center">
                  <div className="font-mono text-[10px] font-bold text-blue-600">M{m.id} ({m.weightPercentage}%)</div>
                  <div className="font-bold text-[11px] text-[#1d1d1f] truncate mt-0.5">{m.shortName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-black/[0.06] bg-[#fbfbfd]">
          <button
            onClick={() => {
              onOpenResearcherManager();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0071e3] transition-colors cursor-pointer"
          >
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>Manage Research Team ({researchers.length} members)</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-[#1d1d1f] px-5 py-2 text-xs font-semibold text-white hover:bg-black active:scale-[0.98] transition-all cursor-pointer"
          >
            Close Menu
          </button>
        </div>
      </div>
    </div>
  );
};
