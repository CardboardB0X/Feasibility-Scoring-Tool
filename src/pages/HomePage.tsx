import React, { useState } from 'react';
import { CapstoneTitle, Researcher } from '../types/scoring';
import { AuthSession } from '../types/auth';
import { generateRoomCode, encryptData, decryptData, formatRoomCode } from '../utils/crypto';
import { saveRoomToCloud, fetchRoomFromCloud } from '../utils/roomApi';
import { SAMPLE_BENCHMARK_TITLES } from '../data/sampleData';
import {
  Scale,
  Sparkles,
  KeyRound,
  Plus,
  ArrowRight,
  ShieldCheck,
  Users,
  Lock,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileText,
  BarChart3,
  HelpCircle,
  Trophy
} from 'lucide-react';
import clsx from 'clsx';

interface HomePageProps {
  session: AuthSession | null;
  activeRoomCode: string | null;
  onStartRoom: (
    roomCode: string,
    titles: CapstoneTitle[],
    evaluator: Researcher,
    isNew: boolean,
    groupName?: string
  ) => void;
  onNavigate: (page: any) => void;
  onOpenAuth: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  session,
  activeRoomCode,
  onStartRoom,
  onNavigate,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<'CREATE' | 'JOIN' | 'DEMO'>('CREATE');

  // Create Room State
  const [groupName, setGroupName] = useState('');
  const [evaluatorName, setEvaluatorName] = useState(session ? session.user.name : '');
  const [evaluatorRole, setEvaluatorRole] = useState(
    session ? session.user.role : 'Lead Dev / Systems Architect'
  );
  const [titleCount, setTitleCount] = useState<number>(3);
  const [titleInputs, setTitleInputs] = useState<string[]>([
    'Title 1: Proposed Capstone Project',
    'Title 2: Proposed Backup Capstone Project',
    'Title 3: Alternative Title'
  ]);

  // Join Room State
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState(session ? session.user.name : '');
  const [joinRole, setJoinRole] = useState(
    session ? session.user.role : 'Researcher Evaluator'
  );
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleTitleCountChange = (count: number) => {
    const clamped = Math.max(2, Math.min(9, count));
    setTitleCount(clamped);
    setTitleInputs((prev) => {
      const next = [...prev];
      while (next.length < clamped) {
        next.push(`Proposed Title ${next.length + 1}`);
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
        title: titleText.trim() || `Proposed Capstone Title ${idx + 1}`,
        description: '',
        category: `Domain ${idx + 1}`,
        createdAt: new Date().toISOString(),
        evaluations: {}
      }));

      const finalGroupName = groupName.trim() || 'Capstone Evaluation';
      const roomPayload = {
        roomCode,
        groupName: finalGroupName,
        titles: newTitles,
        researchers: [newEvaluator],
        createdAt: new Date().toISOString()
      };

      const encrypted = await encryptData(roomPayload, roomCode);
      await saveRoomToCloud(roomCode, encrypted);

      onStartRoom(roomCode, newTitles, newEvaluator, true, finalGroupName);
      onNavigate('dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to initialize encrypted room.');
    } finally {
      setIsCreating(false);
    }
  };

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
      const encrypted = await fetchRoomFromCloud(formattedCode);
      if (!encrypted) {
        setJoinError(`Room "${formattedCode}" was not found. Please check the code.`);
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

        const updatedPayload = {
          ...roomData,
          researchers: updatedResearchers
        };
        const reEncrypted = await encryptData(updatedPayload, formattedCode);
        await saveRoomToCloud(formattedCode, reEncrypted);
      }

      onStartRoom(formattedCode, roomData.titles, currentEvaluator, false, roomData.groupName);
      onNavigate('dashboard');
    } catch (err) {
      console.error(err);
      setJoinError('Could not decrypt room. The room code might be incorrect.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLoadDemo = () => {
    const demoCode = 'CAP-DEMO';
    const demoEvaluator: Researcher = {
      id: 'R1',
      name: session ? session.user.name : 'Lead Dev (Demo Evaluator)',
      role: session ? session.user.role : 'Core Systems Architect',
      avatarColor: 'bg-[#0071e3]'
    };
    onStartRoom(demoCode, SAMPLE_BENCHMARK_TITLES, demoEvaluator, true, 'Benchmark Sample Demo');
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col selection:bg-[#0071e3] selection:text-white pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/80 px-3.5 py-1 text-xs font-bold text-[#0071e3] mb-6 shadow-2xs">
            <Lock className="h-3.5 w-3.5" />
            <span>End-to-End Client-Side AES-256 Encrypted Evaluation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#1d1d1f] tracking-tight leading-tight sm:leading-none">
            Evaluate Capstone Feasibility & Defensibility.
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Objective, closed-choice evaluation for student researchers. Grade <strong>2 to 9 candidate titles</strong> with flashcard questionnaires, instant consensus, and zero-spoiler scoring.
          </p>

          {/* Quick Action Pills if in active room */}
          {activeRoomCode && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 rounded-2xl bg-[#0071e3] text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-[#0077ed] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Return to Active Room ({activeRoomCode})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Start Hub Card */}
      <section className="px-4 sm:px-6 max-w-3xl mx-auto w-full mb-16">
        <div className="rounded-[32px] bg-white/95 backdrop-blur-2xl border border-black/[0.08] shadow-2xl overflow-hidden apple-spring">
          {/* Segmented Control */}
          <div className="p-4 sm:p-6 border-b border-black/[0.06] bg-[#fbfbfd]">
            <div className="flex p-1 rounded-2xl bg-black/[0.05] border border-black/[0.04] text-xs font-semibold w-full">
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

          <div className="p-6 sm:p-8">
            {/* TAB 1: CREATE */}
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
                      Research Group / Course
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

                {/* Candidate Titles Count */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#1d1d1f]">
                      Number of Candidate Titles to Evaluate (2 to 9):
                    </label>
                    <span className="text-xs font-mono font-bold text-[#0071e3] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {titleCount} Titles
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

                {/* Title Inputs */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Candidate Titles:
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
                        placeholder={`Proposed Title #${idx + 1}...`}
                        className="flex-1 rounded-xl border border-black/[0.08] bg-[#fbfbfd] px-3.5 py-2.5 text-base sm:text-sm font-medium focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCreateRoom}
                  disabled={isCreating}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl bg-[#0071e3] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-[#0077ed] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isCreating ? 'Encrypting & Initializing...' : 'Create Encrypted Evaluation Room'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* TAB 2: JOIN */}
            {activeTab === 'JOIN' && (
              <div className="space-y-5 animate-in fade-in max-w-md mx-auto">
                <div>
                  <label className="block text-xs font-bold text-[#1d1d1f] mb-1.5">
                    Room Code <span className="text-red-500">*</span>
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
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    placeholder="e.g. Maria (Data Specialist)"
                    className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] p-3 text-base sm:text-sm font-semibold focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
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
                  <span>{isJoining ? 'Decrypting Room...' : 'Join Evaluation Room'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* TAB 3: DEMO */}
            {activeTab === 'DEMO' && (
              <div className="space-y-4 animate-in fade-in text-center max-w-md mx-auto">
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 leading-relaxed text-left">
                  <strong>9-Title Benchmark Dataset:</strong>
                  <p className="mt-1 text-slate-600">
                    Explore pre-evaluated projects across Computer Vision, IoT, Healthcare, and Robotics demonstrating Approved Finalists, Conditional Backups, and Red Line disqualification.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-purple-500/20 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Launch Benchmark Demo (9 Titles)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto w-full">
        <h3 className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-8">
          Built For Academic Rigor & Defense Readiness
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-black/[0.08] bg-white p-6 shadow-xs space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#0071e3]">
              <Scale className="h-5 w-5" />
            </div>
            <h4 className="text-base font-extrabold text-[#1d1d1f]">18 Closed-Choice Questions</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every question is 100% discrete Likert choices with explicit anchors. No subjective guesswork or scoring ambiguities.
            </p>
          </div>

          <div className="rounded-3xl border border-black/[0.08] bg-white p-6 shadow-xs space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h4 className="text-base font-extrabold text-[#1d1d1f]">Red Line Disqualification</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Immediately flags lethal flaws in programming competence (Q1=1), institutional clearances (Q4=1), or dataset access (Q5=1).
            </p>
          </div>

          <div className="rounded-3xl border border-black/[0.08] bg-white p-6 shadow-xs space-y-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="text-base font-extrabold text-[#1d1d1f]">Adviser Defense Pitch</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated defense pitches, mitigation talking points, and committee recommendations tailored to each candidate title.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
