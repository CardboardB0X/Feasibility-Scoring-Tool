import React, { useState, useEffect, useRef } from 'react';
import { CapstoneTitle, Researcher, LikertPoint } from './types/scoring';
import { AuthSession } from './types/auth';
import { METERS, QUESTIONS, MASTER_LIKERT_ANCHORS } from './data/rubric';
import { SAMPLE_BENCHMARK_TITLES } from './data/sampleData';
import { calculateTitleSummary } from './utils/calculator';
import { encryptData, decryptData, formatRoomCode } from './utils/crypto';
import { saveRoomToCloud, fetchRoomFromCloud } from './utils/roomApi';
import { getActiveSession, logoutUser, addRoomToUserHistory } from './utils/auth';
import { StartScreen } from './components/StartScreen';
import { RoomHeader } from './components/RoomHeader';
import { Navbar } from './components/Navbar';
import { MeterSection } from './components/MeterSection';
import { ScoreGauge } from './components/ScoreGauge';
import { RedLineBanner } from './components/RedLineBanner';
import { MobileBottomBar } from './components/MobileBottomBar';
import { MobileDrawer } from './components/MobileDrawer';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AdviserReportModal } from './components/AdviserReportModal';
import { TitleManagerModal } from './components/TitleManagerModal';
import { ResearcherManagerModal } from './components/ResearcherManagerModal';
import { StartMenuModal } from './components/StartMenuModal';
import { BookOpen, ChevronDown, ChevronUp, Edit3, Layers, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const STORAGE_ACTIVE_ROOM = 'capstone_active_room_v5';

export const App: React.FC = () => {
  // Auth state
  const [session, setSession] = useState<AuthSession | null>(() => getActiveSession());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Room state
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('code=')) {
      const match = hash.match(/code=([A-Za-z0-9-]+)/);
      if (match && match[1]) {
        return formatRoomCode(match[1]);
      }
    }
    return localStorage.getItem(STORAGE_ACTIVE_ROOM) || null;
  });

  const [titles, setTitles] = useState<CapstoneTitle[]>([]);
  const [researchers, setResearchers] = useState<Researcher[]>([]);
  const [activeTitleId, setActiveTitleId] = useState<string>('TITLE-1');
  const [activeResearcherId, setActiveResearcherId] = useState<string>('R1');
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAdviserReportOpen, setIsAdviserReportOpen] = useState(false);
  const [isTitleManagerOpen, setIsTitleManagerOpen] = useState(false);
  const [isResearcherManagerOpen, setIsResearcherManagerOpen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const isInitialMount = useRef(true);

  // Auto-sync room to cloud whenever titles or researchers change
  const syncRoomToCloud = async (
    currentCode: string,
    currentTitles: CapstoneTitle[],
    currentResearchers: Researcher[]
  ) => {
    if (!currentCode) return;
    try {
      setIsSyncing(true);
      const payload = {
        roomCode: currentCode,
        titles: currentTitles,
        researchers: currentResearchers,
        updatedAt: new Date().toISOString()
      };
      const encrypted = await encryptData(payload, currentCode);
      await saveRoomToCloud(currentCode, encrypted);
    } catch (e) {
      console.warn('Sync to cloud failed', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Pull latest updates from cloud
  const handleFetchLatest = async () => {
    if (!activeRoomCode) return;
    try {
      setIsSyncing(true);
      const encrypted = await fetchRoomFromCloud(activeRoomCode);
      if (encrypted) {
        interface DecryptedRoom {
          roomCode: string;
          titles: CapstoneTitle[];
          researchers: Researcher[];
        }
        const decrypted = await decryptData<DecryptedRoom>(encrypted, activeRoomCode);
        if (decrypted && decrypted.titles) {
          setTitles(decrypted.titles);
          if (decrypted.researchers) {
            setResearchers(decrypted.researchers);
          }
        }
      }
    } catch (e) {
      console.error('Fetch latest failed', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // When room is first joined or created
  const handleStartRoom = (
    roomCode: string,
    newTitles: CapstoneTitle[],
    evaluator: Researcher,
    isNew: boolean,
    groupName?: string
  ) => {
    setActiveRoomCode(roomCode);
    setTitles(newTitles);
    setResearchers((prev) => {
      const exists = prev.some((r) => r.id === evaluator.id);
      return exists ? prev : [...prev, evaluator];
    });
    setActiveResearcherId(evaluator.id);
    setActiveTitleId(newTitles[0]?.id || 'TITLE-1');
    localStorage.setItem(STORAGE_ACTIVE_ROOM, roomCode);

    // Save to user's saved rooms history if authenticated
    if (session) {
      addRoomToUserHistory(session.user.id, {
        roomCode,
        groupName: groupName || 'Capstone Evaluation',
        roleInRoom: evaluator.role || 'Evaluator',
        joinedAt: new Date().toISOString(),
        titleCount: newTitles.length
      });
    }

    // Initial sync
    syncRoomToCloud(roomCode, newTitles, [evaluator]);
  };

  // Exit Room back to StartScreen
  const handleExitRoom = () => {
    if (confirm('Exit this evaluation room? You can return anytime using your Room Code.')) {
      setActiveRoomCode(null);
      localStorage.removeItem(STORAGE_ACTIVE_ROOM);
      window.location.hash = '';
    }
  };

  // Select room from user profile
  const handleSelectRoomFromProfile = async (code: string) => {
    try {
      setIsSyncing(true);
      const formattedCode = formatRoomCode(code);
      const encrypted = await fetchRoomFromCloud(formattedCode);
      if (!encrypted) {
        alert(`Room "${formattedCode}" was not found.`);
        return;
      }
      interface DecryptedRoom {
        roomCode: string;
        groupName: string;
        titles: CapstoneTitle[];
        researchers: Researcher[];
      }
      const roomData = await decryptData<DecryptedRoom>(encrypted, formattedCode);
      if (roomData && roomData.titles) {
        setActiveRoomCode(formattedCode);
        setTitles(roomData.titles);
        const myEvaluator =
          (session &&
            roomData.researchers.find(
              (r) => r.name.toLowerCase() === session.user.name.toLowerCase()
            )) ||
          roomData.researchers[0];
        if (myEvaluator) {
          setActiveResearcherId(myEvaluator.id);
        }
        setResearchers(roomData.researchers || []);
        setActiveTitleId(roomData.titles[0]?.id || 'TITLE-1');
        localStorage.setItem(STORAGE_ACTIVE_ROOM, formattedCode);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to load room from profile.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setSession(null);
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            activeRoomCode,
            titles,
            researchers,
            exportedAt: new Date().toISOString()
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `capstone_evaluations_${activeRoomCode || 'backup'}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
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
          if (parsed.activeRoomCode) {
            setActiveRoomCode(parsed.activeRoomCode);
          }
          alert('Evaluations imported successfully!');
        } else {
          alert('Invalid JSON evaluation file.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Load sample benchmark titles
  const handleLoadSampleData = () => {
    if (
      confirm(
        'Load benchmark sample dataset (9 titles across all domains)? Current evaluations will be overwritten.'
      )
    ) {
      setTitles(SAMPLE_BENCHMARK_TITLES);
      setActiveTitleId(SAMPLE_BENCHMARK_TITLES[0].id);
    }
  };

  // Reset all titles evaluations
  const handleResetData = () => {
    if (confirm('Reset all evaluations to blank?')) {
      const reset = titles.map((t) => ({
        ...t,
        evaluations: {}
      }));
      setTitles(reset);
    }
  };

  // If activeRoomCode was restored from localStorage, fetch data on mount
  useEffect(() => {
    if (activeRoomCode && titles.length === 0) {
      handleFetchLatest();
    }
  }, [activeRoomCode]);

  // Periodic auto-sync every 15 seconds if in a room
  useEffect(() => {
    if (!activeRoomCode) return;
    const interval = setInterval(() => {
      handleFetchLatest();
    }, 15000);
    return () => clearInterval(interval);
  }, [activeRoomCode]);

  // Save changes locally and trigger cloud sync
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (activeRoomCode && titles.length > 0) {
      syncRoomToCloud(activeRoomCode, titles, researchers);
    }
  }, [titles, researchers]);

  // If no room is active, render the Pre-Start Setup Screen!
  if (!activeRoomCode || titles.length === 0) {
    return (
      <>
        <StartScreen
          onStartRoom={handleStartRoom}
          session={session}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(newSession) => setSession(newSession)}
        />

        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          session={session}
          onLogout={handleLogout}
          onSelectRoom={handleSelectRoomFromProfile}
          activeRoomCode={activeRoomCode}
        />
      </>
    );
  }

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
      alert(
        'You are currently viewing Group Consensus. Please switch to your evaluator profile in the top bar to submit scores.'
      );
      return;
    }

    setTitles((prevTitles) =>
      prevTitles.map((t) => {
        if (t.id === activeTitle.id) {
          const prevEvaluations = t.evaluations || {};
          const currentScores = prevEvaluations[activeResearcherId] || {};
          return {
            ...t,
            evaluations: {
              ...prevEvaluations,
              [activeResearcherId]: {
                ...currentScores,
                [questionId]: point
              }
            }
          };
        }
        return t;
      })
    );
  };

  const handleUpdateActiveTitle = (
    field: 'title' | 'description' | 'category',
    val: string
  ) => {
    setTitles((prev) =>
      prev.map((t) => (t.id === activeTitle.id ? { ...t, [field]: val } : t))
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col pb-20 lg:pb-0 selection:bg-[#0071e3] selection:text-white">
      {/* Apple-style macOS Navigation Bar */}
      <Navbar
        titles={titles}
        activeTitleId={activeTitleId}
        onSelectTitle={setActiveTitleId}
        researchers={researchers}
        activeResearcherId={activeResearcherId}
        onSelectResearcher={setActiveResearcherId}
        session={session}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
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

      {/* Main Workspace */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 sm:px-6 py-5 sm:py-6">
        {/* Room Code & Encrypted Cloud Sync Bar */}
        <RoomHeader
          roomCode={activeRoomCode}
          researchers={researchers}
          activeResearcherId={activeResearcherId}
          isSyncing={isSyncing}
          onSync={handleFetchLatest}
          onExitRoom={handleExitRoom}
        />

        {/* Active Title Banner */}
        <div className="mb-6 rounded-[24px] border border-black/[0.07] bg-white/95 backdrop-blur-xl p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-black/[0.05] pb-4">
            <div className="flex-1 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-black/[0.05] px-2.5 py-0.5 font-mono text-xs font-bold text-slate-700">
                  TITLE #{activeTitleIndex + 1} OF {titles.length}
                </span>

                <input
                  type="text"
                  value={activeTitle.category || ''}
                  onChange={(e) => handleUpdateActiveTitle('category', e.target.value)}
                  placeholder="Category (e.g. AI, IoT)..."
                  className="rounded-lg border border-black/[0.08] bg-black/[0.02] px-2.5 py-0.5 text-xs font-semibold text-[#0071e3] focus:outline-none focus:border-[#0071e3] focus:bg-white max-w-[200px]"
                />

                {activeResearcherId === 'ALL_AGGREGATED' ? (
                  <span className="rounded-lg bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                    👥 Consensus of {researchers.length} Evaluators
                  </span>
                ) : (
                  <span className="rounded-lg bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    Scoring as: {researchers.find((r) => r.id === activeResearcherId)?.name}
                  </span>
                )}
              </div>

              {/* Title input */}
              <input
                type="text"
                value={activeTitle.title}
                onChange={(e) => handleUpdateActiveTitle('title', e.target.value)}
                placeholder={`Type Capstone Title #${activeTitleIndex + 1}...`}
                className="w-full text-lg sm:text-2xl font-extrabold text-[#1d1d1f] tracking-tight bg-transparent border-b border-dashed border-black/15 focus:border-[#0071e3] focus:outline-none pb-1 placeholder:text-slate-300"
              />

              {/* Scope description */}
              <textarea
                value={activeTitle.description || ''}
                onChange={(e) => handleUpdateActiveTitle('description', e.target.value)}
                placeholder="Brief project scope or objective (optional)..."
                rows={1}
                className="w-full text-xs sm:text-sm text-slate-600 bg-transparent border border-dashed border-black/15 rounded-xl p-2 focus:border-[#0071e3] focus:bg-white focus:outline-none resize-none placeholder:text-slate-300"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsTitleManagerOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                <span>Manage Titles</span>
              </button>
            </div>
          </div>

          {/* Title Carousel / Tabs */}
          <div className="mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
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
                      : "bg-black/[0.04] text-slate-700 hover:bg-black/[0.08]"
                  )}
                >
                  <span>Title {idx + 1}</span>
                  {tSummary.isRedLineTriggered ? (
                    <span
                      className="h-2 w-2 rounded-full bg-red-400 animate-pulse"
                      title="Red Line Disqualified"
                    />
                  ) : tSummary.verdict === 'Approved Finalist' && tSummary.isComplete ? (
                    <span
                      className="h-2 w-2 rounded-full bg-emerald-400"
                      title="Approved Finalist"
                    />
                  ) : tSummary.answeredCount > 0 ? (
                    <span className="text-[10px] opacity-75 font-mono">
                      ({tSummary.answeredCount})
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Red Line Alert Banner */}
        <RedLineBanner violations={summary.redLineViolations} />

        {/* 18 Minimal Questions & Scorecard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Minimal Questions List (Left) */}
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

          {/* Desktop Score Gauge Sidebar (Right) */}
          <div className="hidden lg:block lg:col-span-4">
            <ScoreGauge summary={summary} />
          </div>
        </div>
      </main>

      {/* Mobile Floating Bottom Bar */}
      <MobileBottomBar
        summary={summary}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenReport={() => setIsAdviserReportOpen(true)}
      />

      {/* Slide-Over Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        session={session}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        activeRoomCode={activeRoomCode}
        titleCount={titles.length}
        researcherCount={researchers.length}
        onOpenStartMenu={() => setIsStartMenuOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAdviserReport={() => setIsAdviserReportOpen(true)}
        onOpenTitleManager={() => setIsTitleManagerOpen(true)}
        onOpenResearcherManager={() => setIsResearcherManagerOpen(true)}
        onResetData={handleResetData}
        onExitRoom={handleExitRoom}
      />

      {/* Auth Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(newSession) => setSession(newSession)}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        session={session}
        onLogout={handleLogout}
        onSelectRoom={handleSelectRoomFromProfile}
        activeRoomCode={activeRoomCode}
      />

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

      <StartMenuModal
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        titles={titles}
        activeResearcherId={activeResearcherId}
        researchers={researchers}
        onSelectTitle={setActiveTitleId}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenResearcherManager={() => setIsResearcherManagerOpen(true)}
        onLoadSampleData={handleLoadSampleData}
        onResetData={handleResetData}
      />
    </div>
  );
};
