import React, { useState, useEffect, useRef } from 'react';
import { CapstoneTitle, Researcher, LikertPoint } from './types/scoring';
import { GuestSession } from './types/auth';
import { ActivePage } from './types/navigation';
import { encryptData, decryptData, formatRoomCode } from './utils/crypto';
import { saveRoomToCloud, fetchRoomFromCloud } from './utils/roomApi';
import { getGuestSession, addRoomToUserHistory } from './utils/auth';

import { Navbar } from './components/Navbar';
import { MobileDrawer } from './components/MobileDrawer';
import { ToastNotification, ToastMessage } from './components/ToastNotification';

import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { ResultsPage } from './pages/ResultsPage';
import { EditPage } from './pages/EditPage';
import { AccountPage } from './pages/AccountPage';

const STORAGE_ACTIVE_ROOM = 'capstone_active_room_v5';

export const App: React.FC = () => {
  // Guest Session
  const [session, setSession] = useState<GuestSession | null>(() => getGuestSession());
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: 'success' | 'info' | 'error', message: string, title?: string) => {
    setToast({ id: String(Date.now()), type, message, title });
  };

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

  // Active Page Navigation
  const [activePage, setActivePage] = useState<ActivePage>(() => {
    return activeRoomCode ? 'dashboard' : 'home';
  });

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

    // Save to user's saved rooms history if guest session exists
    if (session) {
      addRoomToUserHistory(session.id, {
        roomCode,
        groupName: groupName || 'Capstone Evaluation',
        roleInRoom: evaluator.role || 'Evaluator',
        joinedAt: new Date().toISOString(),
        titleCount: newTitles.length
      });
    }

    // Initial sync
    syncRoomToCloud(roomCode, newTitles, [evaluator]);
    setActivePage('dashboard');
    showToast('success', `Room ${roomCode} loaded with AES-256 cloud sync`, 'Room Connected');
  };

  // Exit Room back to HomePage
  const handleExitRoom = () => {
    if (confirm('Exit this evaluation room? You can return anytime using your Room Code.')) {
      setActiveRoomCode(null);
      localStorage.removeItem(STORAGE_ACTIVE_ROOM);
      window.location.hash = '';
      setActivePage('home');
      showToast('info', 'Exited evaluation room', 'Navigation');
    }
  };

  // Select room from Account page
  const handleSelectRoomFromAccount = async (code: string) => {
    try {
      setIsSyncing(true);
      const formattedCode = formatRoomCode(code);
      const encrypted = await fetchRoomFromCloud(formattedCode);
      if (!encrypted) {
        showToast('error', `Room "${formattedCode}" not found on cloud database.`, 'Error');
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
              (r) => r.name.toLowerCase() === session.nickname.toLowerCase()
            )) ||
          roomData.researchers[0];
        if (myEvaluator) {
          setActiveResearcherId(myEvaluator.id);
        }
        setResearchers(roomData.researchers || []);
        setActiveTitleId(roomData.titles[0]?.id || 'TITLE-1');
        localStorage.setItem(STORAGE_ACTIVE_ROOM, formattedCode);
        setActivePage('dashboard');
        showToast('success', `Resumed room ${formattedCode}`, 'Room Restored');
      }
    } catch (e) {
      console.error(e);
      showToast('error', 'Failed to load room from account.', 'Error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    showToast('info', 'You have switched session.', 'Account');
  };

  // Score Change Handler for Questionnaire
  const handleScoreChange = (questionId: string, point: LikertPoint) => {
    if (activeResearcherId === 'ALL_AGGREGATED') {
      alert(
        'You are currently viewing Group Consensus. Please switch to your evaluator profile to submit scores.'
      );
      return;
    }

    setTitles((prevTitles) =>
      prevTitles.map((t) => {
        if (t.id === activeTitleId) {
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

  // If activeRoomCode was restored from localStorage, fetch data on mount
  useEffect(() => {
    if (activeRoomCode && titles.length === 0) {
      handleFetchLatest();
    }
  }, [activeRoomCode]);

  // Periodic auto-sync every 8 seconds if in a room
  useEffect(() => {
    if (!activeRoomCode) return;
    const interval = setInterval(() => {
      handleFetchLatest();
    }, 8000);
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

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col selection:bg-[#0071e3] selection:text-white">
      {/* Apple-style macOS Navigation Bar with live cloud sync indicator */}
      <Navbar
        activePage={activePage}
        onNavigate={setActivePage}
        activeRoomCode={activeRoomCode}
        session={session}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Main Pages Switcher */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            session={session}
            activeRoomCode={activeRoomCode}
            onStartRoom={handleStartRoom}
            onNavigate={setActivePage}
            onSessionUpdate={(newSession) => setSession(newSession)}
          />
        )}

        {activePage === 'dashboard' && (
          <>
            {activeRoomCode && titles.length > 0 ? (
              <DashboardPage
                roomCode={activeRoomCode}
                titles={titles}
                researchers={researchers}
                activeResearcherId={activeResearcherId}
                session={session}
                onSelectTitleToScore={(titleId) => {
                  setActiveTitleId(titleId);
                  setActivePage('questionnaire');
                }}
                onSelectTitleToViewResults={(titleId) => {
                  setActiveTitleId(titleId);
                  setActivePage('results');
                }}
                onNavigate={setActivePage}
                onExitRoom={handleExitRoom}
                isSyncing={isSyncing}
                onSync={handleFetchLatest}
              />
            ) : (
              <HomePage
                session={session}
                activeRoomCode={activeRoomCode}
                onStartRoom={handleStartRoom}
                onNavigate={setActivePage}
                onSessionUpdate={(newSession) => setSession(newSession)}
              />
            )}
          </>
        )}

        {activePage === 'questionnaire' && (
          <>
            {activeRoomCode && titles.length > 0 ? (
              <QuestionnairePage
                titles={titles}
                activeTitleId={activeTitleId}
                onSelectTitle={setActiveTitleId}
                researchers={researchers}
                activeResearcherId={activeResearcherId}
                onScoreChange={handleScoreChange}
                onNavigate={setActivePage}
                onSelectTitleToViewResults={(titleId) => {
                  setActiveTitleId(titleId);
                  setActivePage('results');
                }}
              />
            ) : (
              <HomePage
                session={session}
                activeRoomCode={activeRoomCode}
                onStartRoom={handleStartRoom}
                onNavigate={setActivePage}
                onSessionUpdate={(newSession) => setSession(newSession)}
              />
            )}
          </>
        )}

        {activePage === 'results' && (
          <>
            {activeRoomCode && titles.length > 0 ? (
              <ResultsPage
                titles={titles}
                activeTitleId={activeTitleId}
                onSelectTitle={setActiveTitleId}
                researchers={researchers}
                activeResearcherId={activeResearcherId}
                onSelectResearcher={setActiveResearcherId}
                onNavigate={setActivePage}
                onSelectTitleToScore={(titleId) => {
                  setActiveTitleId(titleId);
                  setActivePage('questionnaire');
                }}
              />
            ) : (
              <HomePage
                session={session}
                activeRoomCode={activeRoomCode}
                onStartRoom={handleStartRoom}
                onNavigate={setActivePage}
                onSessionUpdate={(newSession) => setSession(newSession)}
              />
            )}
          </>
        )}

        {activePage === 'edit' && (
          <>
            {activeRoomCode && titles.length > 0 ? (
              <EditPage
                titles={titles}
                onSaveTitles={setTitles}
                researchers={researchers}
                onSaveResearchers={setResearchers}
                activeResearcherId={activeResearcherId}
                onSelectResearcher={setActiveResearcherId}
                onNavigate={setActivePage}
              />
            ) : (
              <HomePage
                session={session}
                activeRoomCode={activeRoomCode}
                onStartRoom={handleStartRoom}
                onNavigate={setActivePage}
                onSessionUpdate={(newSession) => setSession(newSession)}
              />
            )}
          </>
        )}

        {activePage === 'account' && (
          <AccountPage
            session={session}
            onUpdateSession={(updated) => setSession(updated)}
            onSelectRoom={handleSelectRoomFromAccount}
            activeRoomCode={activeRoomCode}
            onNavigate={setActivePage}
          />
        )}
      </main>

      {/* Slide-Over Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        session={session}
        activeRoomCode={activeRoomCode}
        titleCount={titles.length}
        researcherCount={researchers.length}
        activePage={activePage}
        onNavigate={setActivePage}
        onExitRoom={handleExitRoom}
      />

      {/* Animated Action Toast */}
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};
