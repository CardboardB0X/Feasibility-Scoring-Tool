import React, { useState, useEffect } from 'react';
import { CapstoneTitle, Researcher, LikertPoint } from './types/scoring';
import { METERS, QUESTIONS, MASTER_LIKERT_ANCHORS } from './data/rubric';
import { DEFAULT_RESEARCHERS, EMPTY_DEFAULT_TITLES, SAMPLE_BENCHMARK_TITLES, getFreshEmptyTitles } from './data/sampleData';
import { calculateTitleSummary } from './utils/calculator';
import { Navbar } from './components/Navbar';
import { MeterSection } from './components/MeterSection';
import { ScoreGauge } from './components/ScoreGauge';
import { RedLineBanner } from './components/RedLineBanner';
import { StartMenuModal } from './components/StartMenuModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AdviserReportModal } from './components/AdviserReportModal';
import { TitleManagerModal } from './components/TitleManagerModal';
import { ResearcherManagerModal } from './components/ResearcherManagerModal';
import { BookOpen, ChevronDown, ChevronUp, Edit3, Layers, LayoutGrid, Sparkles } from 'lucide-react';
import clsx from 'clsx';

// Storage keys - versioned to load empty titles cleanly by default
const STORAGE_KEY_TITLES = 'capstone_eval_titles_v3_clean';
const STORAGE_KEY_RESEARCHERS = 'capstone_eval_researchers_v3';
const STORAGE_KEY_ACTIVE_TITLE = 'capstone_eval_active_title_v3';
const STORAGE_KEY_ACTIVE_RESEARCHER = 'capstone_eval_active_researcher_v3';
const STORAGE_KEY_HAS_SEEN_START = 'capstone_eval_has_seen_start_v3';

export const App: React.FC = () => {
  // Load persisted state or default to clean empty titles
  const [titles, setTitles] = useState<CapstoneTitle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TITLES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved titles', e);
    }
    return EMPTY_DEFAULT_TITLES;
  });

  const [researchers, setResearchers] = useState<Researcher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESEARCHERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved researchers', e);
    }
    return DEFAULT_RESEARCHERS;
  });

  const [activeTitleId, setActiveTitleId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TITLE);
      if (saved && titles.some(t => t.id === saved)) return saved;
    } catch (e) {}
    return titles[0]?.id || 'TITLE-1';
  });

  const [activeResearcherId, setActiveResearcherId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_RESEARCHER);
      if (saved) return saved;
    } catch (e) {}
    return 'R1';
  });

  // Start Menu & Modals state
  const [isStartMenuOpen, setIsStartMenuOpen] = useState<boolean>(() => {
    try {
      const hasSeen = localStorage.getItem(STORAGE_KEY_HAS_SEEN_START);
      return !hasSeen; // Show Start Menu on first visit
    } catch (e) {
      return true;
    }
  });

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAdviserReportOpen, setIsAdviserReportOpen] = useState(false);
  const [isTitleManagerOpen, setIsTitleManagerOpen] = useState(false);
  const [isResearcherManagerOpen, setIsResearcherManagerOpen] = useState(false);
  const [showAnchorGuide, setShowAnchorGuide] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TITLES, JSON.stringify(titles));
  }, [titles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RESEARCHERS, JSON.stringify(researchers));
  }, [researchers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_TITLE, activeTitleId);
  }, [activeTitleId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_RESEARCHER, activeResearcherId);
  }, [activeResearcherId]);

  const handleCloseStartMenu = () => {
    setIsStartMenuOpen(false);
    localStorage.setItem(STORAGE_KEY_HAS_SEEN_START, 'true');
  };

  // Active Title and summary
  const activeTitle = titles.find((t) => t.id === activeTitleId) || titles[0];
  const activeTitleIndex = titles.findIndex((t) => t.id === activeTitleId);

  const summary = calculateTitleSummary(activeTitle, activeResearcherId, researchers);

  const currentScores =
    activeResearcherId === 'ALL_AGGREGATED'
      ? {}
      : activeTitle?.evaluations?.[activeResearcherId] || {};

  // Score Change Handler
  const handleScoreChange = (questionId: string, point: LikertPoint) => {
    if (activeResearcherId === 'ALL_AGGREGATED') {
      alert('You are currently viewing Consolidated Consensus. Please switch to a specific researcher (e.g. Lead Dev) in the top toolbar to record scores.');
      return;
    }

    setTitles((prevTitles) =>
      prevTitles.map((t) => {
        if (t.id === activeTitle.id) {
          const prevEvaluations = t.evaluations || {};
          const currentResearcherScores = prevEvaluations[activeResearcherId] || {};
          return {
            ...t,
            evaluations: {
              ...prevEvaluations,
              [activeResearcherId]: {
                ...currentResearcherScores,
                [questionId]: point
              }
            }
          };
        }
        return t;
      })
    );
  };

  // Sample Data & Reset Handlers
  const handleLoadSampleData = () => {
    if (confirm('Load the 9 realistic benchmark sample titles with pre-evaluated scores? This is great for demonstration.')) {
      setTitles(SAMPLE_BENCHMARK_TITLES);
      setActiveTitleId(SAMPLE_BENCHMARK_TITLES[0].id);
      setActiveResearcherId('R1');
      setIsStartMenuOpen(false);
    }
  };

  const handleResetData = () => {
    if (confirm('Clear all titles and evaluations back to empty templates?')) {
      const empty = getFreshEmptyTitles();
      setTitles(empty);
      setActiveTitleId(empty[0].id);
      setIsStartMenuOpen(false);
    }
  };

  const handleExportJSON = () => {
    const backup = {
      titles,
      researchers,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Capstone_Evaluations_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.titles && Array.isArray(parsed.titles)) {
          setTitles(parsed.titles);
          if (parsed.researchers && Array.isArray(parsed.researchers)) {
            setResearchers(parsed.researchers);
          }
          setActiveTitleId(parsed.titles[0]?.id || 'TITLE-1');
          alert('Successfully imported evaluations backup!');
        } else {
          alert('Invalid backup JSON format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col selection:bg-[#0071e3] selection:text-white">
      {/* Apple-style macOS Navigation Bar */}
      <Navbar
        titles={titles}
        activeTitleId={activeTitleId}
        onSelectTitle={setActiveTitleId}
        researchers={researchers}
        activeResearcherId={activeResearcherId}
        onSelectResearcher={setActiveResearcherId}
        onOpenStartMenu={() => setIsStartMenuOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAdviserReport={() => setIsAdviserReportOpen(true)}
        onOpenTitleManager={() => setIsTitleManagerOpen(true)}
        onOpenResearcherManager={() => setIsResearcherManagerOpen(true)}
        onLoadSampleData={handleLoadSampleData}
        onResetData={handleResetData}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        {/* Active Title Hero Banner */}
        <div className="mb-6 rounded-[28px] border border-black/[0.07] bg-white/95 backdrop-blur-xl p-6 md:p-8 shadow-xs apple-spring">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.05] pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-lg bg-black/[0.05] px-2.5 py-0.5 font-mono text-xs font-bold text-slate-700">
                  TITLE #{activeTitleIndex + 1} OF {titles.length}
                </span>
                {activeTitle.category && (
                  <span className="rounded-lg bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-xs font-semibold text-[#0071e3]">
                    {activeTitle.category}
                  </span>
                )}
                {activeResearcherId === 'ALL_AGGREGATED' ? (
                  <span className="rounded-lg bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                    👥 Consolidated Group Consensus
                  </span>
                ) : (
                  <span className="rounded-lg bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    Evaluator: {researchers.find(r => r.id === activeResearcherId)?.name}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight leading-snug">
                {activeTitle.title}
              </h1>

              {activeTitle.description && (
                <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
                  {activeTitle.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => setIsTitleManagerOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-black/[0.08] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                <span>Rename / Edit Title</span>
              </button>
            </div>
          </div>

          {/* Quick Title Tabs */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-slate-400 mr-1 text-[11px] uppercase tracking-wider">
              Titles:
            </span>
            {titles.map((t, idx) => {
              const isActive = t.id === activeTitleId;
              const tSummary = calculateTitleSummary(t, activeResearcherId, researchers);

              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTitleId(t.id)}
                  className={clsx(
                    "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition-all cursor-pointer",
                    isActive
                      ? "bg-[#0071e3] text-white shadow-xs"
                      : "bg-black/[0.04] text-slate-600 hover:bg-black/[0.08]"
                  )}
                >
                  <span>Title {idx + 1}</span>
                  {tSummary.isRedLineTriggered ? (
                    <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" title="Red Line Disqualified" />
                  ) : tSummary.verdict === 'Approved Finalist' && tSummary.isComplete ? (
                    <span className="h-2 w-2 rounded-full bg-emerald-400" title="Approved Finalist" />
                  ) : tSummary.answeredCount > 0 ? (
                    <span className="text-[10px] opacity-75 font-mono">({tSummary.answeredCount})</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Red Line Alert Banner */}
        <RedLineBanner violations={summary.redLineViolations} />

        {/* Master Likert Scale Anchor Reference (collapsible) */}
        <div className="mb-6 rounded-2xl border border-black/[0.06] bg-white/80 p-4 shadow-2xs backdrop-blur-md">
          <button
            onClick={() => setShowAnchorGuide(!showAnchorGuide)}
            className="flex w-full items-center justify-between text-left text-xs font-semibold text-slate-800 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#0071e3]" />
              <span className="font-bold">Master Scoring Scale Likert Anchors Reference</span>
              <span className="text-slate-400 hidden sm:inline">
                (Standard 1 to 5 defined points)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#0071e3] text-xs font-medium">
              <span>{showAnchorGuide ? 'Hide Anchors' : 'Show Anchors'}</span>
              {showAnchorGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>

          {showAnchorGuide && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-3 border-t border-black/[0.05] animate-in fade-in">
              {MASTER_LIKERT_ANCHORS.map((anchor) => (
                <div key={anchor.point} className="rounded-xl border border-black/[0.04] bg-[#fbfbfd] p-3 text-xs">
                  <div className="font-bold text-[#1d1d1f]">{anchor.label}</div>
                  <div className="mt-0.5 text-slate-500 text-[11px] leading-snug">{anchor.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evaluation Layout: 18 Questions (Left) + Score Gauge (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Questions Column */}
          <div className="lg:col-span-8 space-y-2">
            {METERS.map((meter) => {
              const meterQuestions = QUESTIONS.filter((q) => q.meterId === meter.id);
              const meterDetail = summary.meterScores.find((m) => m.meterId === meter.id);

              return (
                <MeterSection
                  key={meter.id}
                  meter={meter}
                  questions={meterQuestions}
                  scores={currentScores}
                  meterScoreDetail={meterDetail}
                  onScoreChange={handleScoreChange}
                  readOnly={activeResearcherId === 'ALL_AGGREGATED'}
                />
              );
            })}
          </div>

          {/* Sticky Score Gauge Sidebar */}
          <div className="lg:col-span-4">
            <ScoreGauge summary={summary} />

            {/* Quick Rules Card */}
            <div className="mt-5 rounded-[26px] border border-black/[0.07] bg-white/95 backdrop-blur-xl p-5 text-xs text-slate-600 shadow-xs">
              <h4 className="font-bold text-[#1d1d1f] uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#0071e3]" />
                Adviser Presentation Rules
              </h4>
              <ul className="space-y-2 text-slate-600 leading-relaxed text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#34c759] shrink-0">≥ 4.00 CTS:</span>
                  <span><strong>Approved Finalist</strong>. Recommended for formal title submission.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#ff9500] shrink-0">3.30–3.99 CTS:</span>
                  <span><strong>Conditional Backup</strong>. Requires cutting high-friction modules.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-slate-500 shrink-0">&lt; 3.30 CTS:</span>
                  <span><strong>Discarded</strong>. Not technically defensible.</span>
                </li>
                <li className="flex items-start gap-1.5 pt-1.5 border-t border-black/[0.05]">
                  <span className="font-bold text-[#ff3b30] shrink-0">The Red Line:</span>
                  <span>Score 1 on Q1, Q4, or Q5 drops the title immediately regardless of CTS!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.06] bg-white py-5 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Capstone Title Feasibility Evaluator • Apple-Style 18-Question Rubric
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStartMenuOpen(true)}
              className="text-[#0071e3] hover:underline font-medium cursor-pointer"
            >
              Open Start Menu
            </button>
            <span>•</span>
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="text-[#0071e3] hover:underline font-medium cursor-pointer"
            >
              Compare Titles Matrix
            </button>
          </div>
        </div>
      </footer>

      {/* Start Menu / Launchpad Modal */}
      <StartMenuModal
        isOpen={isStartMenuOpen}
        onClose={handleCloseStartMenu}
        titles={titles}
        activeResearcherId={activeResearcherId}
        researchers={researchers}
        onSelectTitle={setActiveTitleId}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenResearcherManager={() => setIsResearcherManagerOpen(true)}
        onLoadSampleData={handleLoadSampleData}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        titles={titles}
        activeResearcherId={activeResearcherId}
        researchers={researchers}
        onSelectTitle={setActiveTitleId}
      />

      {/* Adviser Report Modal */}
      <AdviserReportModal
        isOpen={isAdviserReportOpen}
        onClose={() => setIsAdviserReportOpen(false)}
        title={activeTitle}
        summary={summary}
        researchers={researchers}
        activeResearcherId={activeResearcherId}
      />

      {/* Title Manager Modal */}
      <TitleManagerModal
        isOpen={isTitleManagerOpen}
        onClose={() => setIsTitleManagerOpen(false)}
        titles={titles}
        onSaveTitles={setTitles}
        activeTitleId={activeTitleId}
        onSelectTitle={setActiveTitleId}
      />

      {/* Researcher Manager Modal */}
      <ResearcherManagerModal
        isOpen={isResearcherManagerOpen}
        onClose={() => setIsResearcherManagerOpen(false)}
        researchers={researchers}
        onSaveResearchers={setResearchers}
        activeResearcherId={activeResearcherId}
        onSelectResearcher={setActiveResearcherId}
      />
    </div>
  );
};
