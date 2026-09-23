import React, { useState, useEffect } from 'react';
import { CapstoneTitle, Researcher, LikertPoint } from './types/scoring';
import { METERS, QUESTIONS, MASTER_LIKERT_ANCHORS } from './data/rubric';
import { DEFAULT_RESEARCHERS, INITIAL_TITLES, getFreshEmptyTitles } from './data/sampleData';
import { calculateTitleSummary } from './utils/calculator';
import { Navbar } from './components/Navbar';
import { MeterSection } from './components/MeterSection';
import { ScoreGauge } from './components/ScoreGauge';
import { RedLineBanner } from './components/RedLineBanner';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AdviserReportModal } from './components/AdviserReportModal';
import { TitleManagerModal } from './components/TitleManagerModal';
import { ResearcherManagerModal } from './components/ResearcherManagerModal';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp, Edit3, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import clsx from 'clsx';

const STORAGE_KEY_TITLES = 'capstone_eval_titles_v2';
const STORAGE_KEY_RESEARCHERS = 'capstone_eval_researchers_v2';
const STORAGE_KEY_ACTIVE_TITLE = 'capstone_eval_active_title_v2';
const STORAGE_KEY_ACTIVE_RESEARCHER = 'capstone_eval_active_researcher_v2';

export const App: React.FC = () => {
  // Load persisted state or fallback
  const [titles, setTitles] = useState<CapstoneTitle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TITLES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved titles', e);
    }
    return INITIAL_TITLES;
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

  // Modals state
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

  // Current title and evaluation summary
  const activeTitle = titles.find((t) => t.id === activeTitleId) || titles[0];
  const activeTitleIndex = titles.findIndex((t) => t.id === activeTitleId);

  const summary = calculateTitleSummary(activeTitle, activeResearcherId, researchers);

  // Active scores for current researcher
  const currentScores =
    activeResearcherId === 'ALL_AGGREGATED'
      ? {} // In consensus mode, show averaged state or read-only
      : activeTitle?.evaluations?.[activeResearcherId] || {};

  // Score Change Handler
  const handleScoreChange = (questionId: string, point: LikertPoint) => {
    if (activeResearcherId === 'ALL_AGGREGATED') {
      alert('You are currently viewing Consolidated Group Consensus. Please switch to a specific researcher (e.g. Lead Dev) in the top bar to record individual scores.');
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

  // Actions
  const handleLoadSampleData = () => {
    if (confirm('Load 9 sample capstone titles with complete benchmark evaluations? This will overwrite existing draft entries.')) {
      setTitles(INITIAL_TITLES);
      setActiveTitleId(INITIAL_TITLES[0].id);
      setActiveResearcherId('R1');
    }
  };

  const handleResetData = () => {
    if (confirm('Reset all titles and evaluations to blank templates?')) {
      const empty = getFreshEmptyTitles();
      setTitles(empty);
      setActiveTitleId(empty[0].id);
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
          alert('Successfully imported capstone evaluations backup!');
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        titles={titles}
        activeTitleId={activeTitleId}
        onSelectTitle={setActiveTitleId}
        researchers={researchers}
        activeResearcherId={activeResearcherId}
        onSelectResearcher={setActiveResearcherId}
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
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {/* Current Active Title Hero Banner */}
        <div className="mb-8 rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-lg bg-blue-100 px-2.5 py-0.5 font-mono text-xs font-black text-blue-900">
                  TITLE #{activeTitleIndex + 1} OF {titles.length}
                </span>
                {activeTitle.category && (
                  <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                    {activeTitle.category}
                  </span>
                )}
                {activeResearcherId === 'ALL_AGGREGATED' ? (
                  <span className="rounded-lg bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-900 flex items-center gap-1">
                    👥 Group Consensus View
                  </span>
                ) : (
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
                    Evaluating as: {researchers.find(r => r.id === activeResearcherId)?.name}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
                {activeTitle.title}
              </h1>

              {activeTitle.description && (
                <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
                  {activeTitle.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => setIsTitleManagerOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                <span>Edit Title Details</span>
              </button>
            </div>
          </div>

          {/* Quick Pagination / Title Tabs */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-slate-400 mr-1 text-[11px] uppercase tracking-wider">
              Quick Jump:
            </span>
            {titles.map((t, idx) => {
              const isActive = t.id === activeTitleId;
              const tSummary = calculateTitleSummary(t, activeResearcherId, researchers);

              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTitleId(t.id)}
                  className={clsx(
                    "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-all cursor-pointer",
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  <span>Title {idx + 1}</span>
                  {tSummary.isRedLineTriggered ? (
                    <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" title="Red Line Disqualified" />
                  ) : tSummary.verdict === 'Approved Finalist' ? (
                    <span className="h-2 w-2 rounded-full bg-emerald-400" title="Approved Finalist" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Red Line Alert Banner (if Q1, Q4, or Q5 has score 1) */}
        <RedLineBanner violations={summary.redLineViolations} />

        {/* Master Likert Scale Anchor Reference (collapsible) */}
        <div className="mb-8 rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 p-4 shadow-2xs">
          <button
            onClick={() => setShowAnchorGuide(!showAnchorGuide)}
            className="flex w-full items-center justify-between text-left text-xs font-bold text-blue-950 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span>Master Scoring Scale Likert Anchors Reference</span>
              <span className="text-[11px] font-normal text-blue-800 hidden sm:inline">
                (Standard 1 to 5 points defined scale)
              </span>
            </div>
            <div className="flex items-center gap-1 text-blue-700 text-xs">
              <span>{showAnchorGuide ? 'Hide' : 'Show Anchors'}</span>
              {showAnchorGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </button>

          {showAnchorGuide && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-3 border-t border-blue-200/60 animate-in fade-in">
              {MASTER_LIKERT_ANCHORS.map((anchor) => (
                <div key={anchor.point} className="rounded-xl border border-blue-200 bg-white/90 p-3 text-xs">
                  <div className="font-extrabold text-blue-900">{anchor.label}</div>
                  <div className="mt-0.5 text-slate-600 font-medium">{anchor.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evaluation Layout: 18 Questions (Left) + Score Gauge (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Questions Column (8 cols on large screens) */}
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

          {/* Sticky Score Gauge Sidebar (4 cols on large screens) */}
          <div className="lg:col-span-4">
            <ScoreGauge summary={summary} />

            {/* Quick Helper / Info Card */}
            <div className="mt-6 rounded-3xl border border-slate-200/90 bg-white p-6 text-xs text-slate-600 shadow-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                Adviser Presentation Rules
              </h4>
              <ul className="space-y-2 text-slate-600 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-emerald-600 shrink-0">≥ 4.00 CTS:</span>
                  <span><strong>Approved Finalist</strong>. Submit directly to panel chair.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-amber-600 shrink-0">3.30–3.99 CTS:</span>
                  <span><strong>Conditional Backup</strong>. Requires cutting high-friction modules.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-rose-600 shrink-0">&lt; 3.30 CTS:</span>
                  <span><strong>Discarded</strong>. Not technically defensible.</span>
                </li>
                <li className="flex items-start gap-1.5 pt-1 border-t border-slate-100">
                  <span className="font-bold text-red-600 shrink-0">Red Line:</span>
                  <span>Score 1 on Q1, Q4, or Q5 drops the title instantly regardless of CTS!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Capstone Title Feasibility Evaluator • Standard Likert 18-Question Closed-Choice System
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Formula: CTS = Σ (M_i × Weight)</span>
            <span>•</span>
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Compare All Titles
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        titles={titles}
        activeResearcherId={activeResearcherId}
        researchers={researchers}
        onSelectTitle={setActiveTitleId}
      />

      <AdviserReportModal
        isOpen={isAdviserReportOpen}
        onClose={() => setIsAdviserReportOpen(false)}
        title={activeTitle}
        summary={summary}
        researchers={researchers}
        activeResearcherId={activeResearcherId}
      />

      <TitleManagerModal
        isOpen={isTitleManagerOpen}
        onClose={() => setIsTitleManagerOpen(false)}
        titles={titles}
        onSaveTitles={setTitles}
        activeTitleId={activeTitleId}
        onSelectTitle={setActiveTitleId}
      />

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
