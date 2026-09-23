import React, { useState, useEffect } from 'react';
import { CapstoneTitle, Researcher } from '../types/scoring';
import { AuthSession } from '../types/auth';
import { generateRoomCode, encryptData, decryptData, formatRoomCode } from '../utils/crypto';
import { saveRoomToCloud, fetchRoomFromCloud } from '../utils/roomApi';
import { getUserRooms } from '../utils/auth';
import { SAMPLE_BENCHMARK_TITLES } from '../data/sampleData';
import {
  Scale,
  Sparkles,
  KeyRound,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Users,
  Lock,
  Layers,
  CheckCircle2,
  AlertCircle,
  LogIn,
  User,
  DoorOpen,
  Calendar
} from 'lucide-react';
import clsx from 'clsx';

interface StartScreenProps {
  onStartRoom: (
    roomCode: string,
    titles: CapstoneTitle[],
    evaluator: Researcher,
    isNew: boolean,
    groupName?: string
  ) => void;
  session: AuthSession | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartRoom,
  session,
  onOpenAuth,
  onOpenProfile
}) => {
  const [activeTab, setActiveTab] = useState<'CREATE' | 'JOIN' | 'DEMO'>('CREATE');

  // Create Room State
  const [groupName, setGroupName] = useState('');
  const [evaluatorName, setEvaluatorName] = useState(session ? session.user.name : '');
  const [evaluatorRole, setEvaluatorRole] = useState(
    session ? session.user.role : 'Lead Dev / Systems Architect'
  );
  const [titleCount, setTitleCount] = useState<number>(3); // Defaults to 3, allowed 2 to 9
  const [titleInputs, setTitleInputs] = useState<string[]>(['', '', '']);

  // Join Room State
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState(session ? session.user.name : '');
  const [joinRole, setJoinRole] = useState(
    session ? session.user.role : 'Researcher Evaluator'
  );
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Sync inputs with session if user signs in while on StartScreen
  useEffect(() => {
    if (session) {
      if (!evaluatorName) setEvaluatorName(session.user.name);
      if (!evaluatorRole || evaluatorRole === 'Lead Dev / Systems Architect') {
        setEvaluatorRole(session.user.role);
      }
      if (!joinName) setJoinName(session.user.name);
      if (!joinRole || joinRole === 'Researcher Evaluator') {
        setJoinRole(session.user.role);
      }
    }
  }, [session]);

  const userRooms = session ? getUserRooms(session.user.id) : [];

  // When title count changes, expand or shrink titleInputs
  const handleTitleCountChange = (count: number) => {
    const clamped = Math.max(2, Math.min(9, count));
    setTitleCount(clamped);

    setTitleInputs((prev) => {
      const next = [...prev];
      while (next.length < clamped) {
        next.push('');
      }
      return next.slice(0, clamped);
    });
  };

  const handleTitleInputChange = (index: number, val: string) => {
    setTitleInputs((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  // Create New Encrypted Room Handler
  const handleCreateRoom = async () => {
    if (!evaluatorName.trim()) {
      alert('Please enter your evaluator name.');
      return;
    }

    setIsCreating(true);
    try {
      const roomCode = generateRoomCode();
      const evaluatorId = session ? session.user.id : `R-${Date.now()}`;
      const newEvaluator: Researcher = {
        id: evaluatorId,
        name: evaluatorName.trim(),
        role: evaluatorRole.trim() || 'Evaluator',
        avatarColor: session ? session.user.avatarColor : 'bg-[#0071e3]'
      };

      const newTitles: CapstoneTitle[] = titleInputs.map((titleText, idx) => ({
        id: `TITLE-${idx + 1}`,
        title: titleText.trim(),
        description: '',
        category: '',
        createdAt: new Date().toISOString(),
        evaluations: {}
      }));

      const finalGroupName = groupName.trim() || 'Capstone Evaluation';

      // Room payload for encryption
      const roomPayload = {
        roomCode,
        groupName: finalGroupName,
        titles: newTitles,
        researchers: [newEvaluator],
        createdAt: new Date().toISOString()
      };

      // Encrypt client-side using Web Crypto AES-256-GCM
      const encrypted = await encryptData(roomPayload, roomCode);

      // Save to cloud database
      await saveRoomToCloud(roomCode, encrypted);

      // Launch room
      onStartRoom(roomCode, newTitles, newEvaluator, true, finalGroupName);
    } catch (err) {
      console.error(err);
      alert('Failed to initialize encrypted room.');
    } finally {
      setIsCreating(false);
    }
  };

  // Join Existing Room Handler
  const handleJoinRoom = async () => {
    setJoinError(null);
    if (!joinCode.trim()) {
      setJoinError('Please enter a room code.');
      return;
    }
    if (!joinName.trim()) {
      setJoinError('Please enter your name.');
      return;
    }

    const formattedCode = formatRoomCode(joinCode);
    setIsJoining(true);

    try {
      // 1. Fetch encrypted room from cloud database
      const encrypted = await fetchRoomFromCloud(formattedCode);
      if (!encrypted) {
        setJoinError(`Room "${formattedCode}" was not found. Please check the code.`);
        setIsJoining(false);
        return;
      }

      // 2. Decrypt with room code
      interface DecryptedRoom {
        roomCode: string;
        groupName: string;
        titles: CapstoneTitle[];
        researchers: Researcher[];
      }

      const roomData = await decryptData<DecryptedRoom>(encrypted, formattedCode);

      // 3. Register joiner researcher
      const existing = roomData.researchers.find(
        (r) => r.name.toLowerCase() === joinName.trim().toLowerCase()
      );

      let currentEvaluator: Researcher;
      let updatedResearchers = [...roomData.researchers];

      if (existing) {
        currentEvaluator = existing;
      } else {
        const newId = session ? session.user.id : `R-${Date.now()}`;
        currentEvaluator = {
          id: newId,
          name: joinName.trim(),
          role: joinRole.trim() || 'Evaluator',
          avatarColor: session ? session.user.avatarColor : 'bg-[#34c759]'
        };
        updatedResearchers.push(currentEvaluator);

        // Save updated participant list back to database
        const updatedPayload = {
          ...roomData,
          researchers: updatedResearchers
        };
        const reEncrypted = await encryptData(updatedPayload, formattedCode);
        await saveRoomToCloud(formattedCode, reEncrypted);
      }

      // Launch into room
      onStartRoom(formattedCode, roomData.titles, currentEvaluator, false, roomData.groupName);
    } catch (err) {
      console.error(err);
      setJoinError('Could not decrypt room. The room code might be incorrect.');
    } finally {
      setIsJoining(false);
    }
  };

  // Resume Room from User History
  const handleResumeRoom = async (code: string) => {
    setIsJoining(true);
    try {
      const formattedCode = formatRoomCode(code);
      const encrypted = await fetchRoomFromCloud(formattedCode);
      if (!encrypted) {
        alert(`Room "${formattedCode}" was not found.`);
        setIsJoining(false);
        return;
      }

      interface DecryptedRoom {
        roomCode: string;
        groupName: string;
        titles: CapstoneTitle[];
        researchers: Researcher[];
      }

      const roomData = await decryptData<DecryptedRoom>(encrypted, formattedCode);
      const currentEvaluator =
        (session &&
          roomData.researchers.find(
            (r) => r.name.toLowerCase() === session.user.name.toLowerCase()
          )) ||
        roomData.researchers[0] || {
          id: `R-${Date.now()}`,
          name: session ? session.user.name : 'Evaluator',
          role: session ? session.user.role : 'Evaluator',
          avatarColor: 'bg-[#0071e3]'
        };

      onStartRoom(formattedCode, roomData.titles, currentEvaluator, false, roomData.groupName);
    } catch (e) {
      console.error(e);
      alert('Failed to resume room.');
    } finally {
      setIsJoining(false);
    }
  };

  // Demo Sample Loader
  const handleLoadDemo = () => {
    const demoCode = 'CAP-DEMO';
    const demoEvaluator: Researcher = {
      id: 'R1',
      name: session ? session.user.name : 'Lead Dev (Demo Evaluator)',
      role: session ? session.user.role : 'Core Systems Architect',
      avatarColor: 'bg-[#0071e3]'
    };
    onStartRoom(demoCode, SAMPLE_BENCHMARK_TITLES, demoEvaluator, true, 'Sample Benchmark Demo');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col justify-center items-center px-4 py-8 sm:px-6 selection:bg-[#0071e3] selection:text-white">
      <div className="w-full max-w-2xl rounded-[32px] bg-white/95 backdrop-blur-2xl border border-black/[0.08] shadow-2xl overflow-hidden apple-spring">
        {/* macOS Window Titlebar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-black/[0.06] bg-[#fbfbfd]/90 select-none">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
          </div>

          <div className="text-xs font-semibold text-slate-500 tracking-tight flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5 text-[#0071e3]" />
            <span className="hidden sm:inline">Capstone Feasibility Evaluation System</span>
            <span className="sm:hidden">Capstone System</span>
          </div>

          {/* User Auth Pill or Sign In Button */}
          <div className="flex items-center gap-2">
            {session ? (
              <button
                onClick={onOpenProfile}
                title="View Profile & Rooms"
                className="flex items-center gap-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <div
                  className={clsx(
                    "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white",
                    session.user.avatarColor || 'bg-[#0071e3]'
                  )}
                >
                  {session.user.name.slice(0, 1).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{session.user.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white px-2.5 py-1 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <LogIn className="h-3 w-3" />
                <span>Sign In</span>
              </button>
            )}

            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full hidden sm:flex">
              <Lock className="h-3 w-3 text-emerald-600" />
              <span>AES-256</span>
            </div>
          </div>
        </div>

        {/* Start Header */}
        <div className="p-6 sm:p-8 text-center border-b border-black/[0.05] bg-gradient-to-b from-blue-500/5 to-transparent">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0071e3] to-[#47a3ff] text-white shadow-lg shadow-blue-500/25 mb-4">
            <Scale className="h-8 w-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
            Capstone Title Feasibility Evaluator
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Collaborative, encrypted closed-choice evaluation for student research teams. Evaluate <strong>at least 2 and up to 9 titles</strong> with real-time shared results.
          </p>

          {/* Apple Segmented Control */}
          <div className="mt-6 inline-flex p-1 rounded-2xl bg-black/[0.05] border border-black/[0.04] text-xs font-semibold max-w-md w-full">
            <button
              onClick={() => setActiveTab('CREATE')}
              className={clsx(
                "flex-1 min-h-[44px] py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5",
                activeTab === 'CREATE'
                  ? "bg-white text-[#1d1d1f] shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Room</span>
            </button>

            <button
              onClick={() => setActiveTab('JOIN')}
              className={clsx(
                "flex-1 min-h-[44px] py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5",
                activeTab === 'JOIN'
                  ? "bg-white text-[#1d1d1f] shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Join with Code</span>
            </button>

            <button
              onClick={() => setActiveTab('DEMO')}
              className={clsx(
                "flex-1 min-h-[44px] py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5",
                activeTab === 'DEMO'
                  ? "bg-white text-[#1d1d1f] shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>Demo Sample</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: CREATE ROOM */}
          {activeTab === 'CREATE' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1d1d1f] mb-1.5">
                    Your Name / Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={evaluatorName}
                    onChange={(e) => setEvaluatorName(e.target.value)}
                    placeholder="e.g. Lead Dev or Maria"
                    className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] p-3 text-base sm:text-sm font-semibold focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1d1d1f] mb-1.5">
                    Research Group / Subject
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g. BSCS Capstone 2026"
                    className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] p-3 text-base sm:text-sm focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Title Count Selector: 2 to 9 titles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#1d1d1f]">
                    Number of Candidate Titles to Evaluate (2 to 9):
                  </label>
                  <span className="text-xs font-mono font-bold text-[#0071e3] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {titleCount} Titles Selected
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleTitleCountChange(num)}
                      className={clsx(
                        "flex-1 min-h-[44px] py-2 px-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer",
                        titleCount === num
                          ? "bg-[#0071e3] text-white shadow-xs"
                          : "bg-black/[0.04] text-slate-700 hover:bg-black/[0.08]"
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Inputs List */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Proposed Titles (Editable anytime):
                </label>
                {titleInputs.map((titleText, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] text-[11px] font-bold font-mono text-slate-500">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={titleText}
                      onChange={(e) => handleTitleInputChange(idx, e.target.value)}
                      placeholder={`Enter Proposed Title #${idx + 1}...`}
                      className="flex-1 rounded-xl border border-black/[0.08] bg-[#fbfbfd] px-3.5 py-2.5 text-base sm:text-sm font-medium focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCreateRoom}
                  disabled={isCreating}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl bg-[#0071e3] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-[#0077ed] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isCreating ? 'Encrypting & Creating...' : 'Create Encrypted Evaluation Room'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-2 text-[11px] text-slate-400 text-center">
                  Generates a 6-character room code. All data is encrypted client-side using AES-256-GCM.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: JOIN WITH ROOM CODE */}
          {activeTab === 'JOIN' && (
            <div className="space-y-5 animate-in fade-in max-w-md mx-auto">
              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1.5">
                  Enter 6-Character Room Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="e.g. CAP-7429"
                    maxLength={10}
                    className="w-full rounded-2xl border-2 border-black/[0.1] bg-[#fbfbfd] p-3.5 text-center font-mono text-lg font-black tracking-widest text-[#1d1d1f] focus:bg-white focus:border-[#0071e3] focus:outline-none uppercase transition-all"
                  />
                  <KeyRound className="absolute right-3.5 top-4 h-5 w-5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1.5">
                  Your Evaluator Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  placeholder="e.g. Maria (Data Specialist)"
                  className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] p-3 text-base sm:text-sm font-semibold focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1.5">
                  Your Role
                </label>
                <input
                  type="text"
                  value={joinRole}
                  onChange={(e) => setJoinRole(e.target.value)}
                  placeholder="e.g. Data Engineer, QA Tester, Panel Member"
                  className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] p-3 text-base sm:text-sm focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                />
              </div>

              {joinError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{joinError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleJoinRoom}
                disabled={isJoining}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl bg-[#1d1d1f] py-3.5 text-sm font-bold text-white shadow-md hover:bg-black active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="h-4 w-4 text-amber-400" />
                <span>{isJoining ? 'Decrypting Room...' : 'Join & View Questionnaire'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Entering this code decrypts the room data and allows you to fill out your evaluation and see the consolidated results alongside other team members.
              </p>
            </div>
          )}

          {/* TAB 3: DEMO SAMPLE DATA */}
          {activeTab === 'DEMO' && (
            <div className="space-y-4 animate-in fade-in text-center max-w-md mx-auto">
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 leading-relaxed text-left">
                <strong>Benchmark Exploration Mode:</strong>
                <p className="mt-1 text-slate-600">
                  Instantly populates 9 realistic capstone titles (Computer Vision, IoT, Healthcare, Robotics, etc.) with pre-evaluated scores demonstrating Approved Finalists, Conditional Backups, Discarded titles, and Red Line disqualification.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadDemo}
                className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-purple-500/20 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Launch Benchmark Sample (9 Titles)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Saved Rooms for Logged In User */}
          {session && userRooms.length > 0 && (
            <div className="mt-8 pt-6 border-t border-black/[0.06] animate-in fade-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Resume Your Saved Rooms
                </span>
                <button
                  onClick={onOpenProfile}
                  className="text-xs font-bold text-[#0071e3] hover:underline cursor-pointer"
                >
                  View All ({userRooms.length})
                </button>
              </div>

              <div className="space-y-2">
                {userRooms.slice(0, 3).map((room) => (
                  <div
                    key={room.roomCode}
                    className="flex items-center justify-between p-3 rounded-2xl border border-black/[0.06] bg-[#fbfbfd] hover:border-black/[0.12] transition-all"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#1d1d1f] bg-black/[0.05] px-2 py-0.5 rounded-md">
                          {room.roomCode}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {room.groupName || 'Evaluation Room'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {room.titleCount || 3} Titles &bull; {room.roleInRoom}
                      </div>
                    </div>

                    <button
                      onClick={() => handleResumeRoom(room.roomCode)}
                      disabled={isJoining}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#0071e3] text-white hover:bg-[#0077ed] text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1 shrink-0"
                    >
                      <span>Resume</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
