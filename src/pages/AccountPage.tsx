import React, { useState } from 'react';
import { GuestSession } from '../types/auth';
import { getUserRooms, saveGuestSession, clearGuestSession, AVATAR_COLORS } from '../utils/auth';
import confetti from 'canvas-confetti';
import {
  User,
  ShieldCheck,
  DoorOpen,
  Calendar,
  Layers,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  Check,
  RotateCcw
} from 'lucide-react';
import clsx from 'clsx';

interface AccountPageProps {
  session: GuestSession | null;
  onUpdateSession: (updated: GuestSession) => void;
  onSelectRoom: (roomCode: string) => void;
  activeRoomCode: string | null;
  onNavigate: (page: any) => void;
}

const AVAILABLE_ROLES = [
  'Researcher Evaluator',
  'Lead Developer / Architect',
  'Systems Analyst',
  'UI/UX Designer',
  'QA / Testing Specialist',
  'Database Administrator',
  'Faculty Adviser / Panelist',
  'Student Observer'
];

export const AccountPage: React.FC<AccountPageProps> = ({
  session,
  onUpdateSession,
  onSelectRoom,
  activeRoomCode,
  onNavigate
}) => {
  const [nickname, setNickname] = useState(session?.nickname || '');
  const [role, setRole] = useState(session?.role || 'Researcher Evaluator');
  const [selectedColor, setSelectedColor] = useState(session?.avatarColor || AVATAR_COLORS[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const userRooms = session ? getUserRooms(session.id) : [];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!nickname.trim()) {
      setErrorMsg('Nickname cannot be empty.');
      return;
    }

    try {
      const updated = saveGuestSession(nickname.trim(), role, selectedColor);
      onUpdateSession(updated);
      setSaveSuccess(true);

      // Colorful burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0071e3', '#34c759', '#ff9500', '#af52de']
      });

      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update profile.');
    }
  };

  const handleResetSession = () => {
    if (confirm('Clear current guest session and choose a new nickname?')) {
      clearGuestSession();
      setNickname('');
      setRole('Researcher Evaluator');
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] pb-24 px-4 sm:px-6 max-w-4xl mx-auto pt-6 selection:bg-[#0071e3] selection:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => onNavigate(activeRoomCode ? 'dashboard' : 'home')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0071e3] transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{activeRoomCode ? 'Back to Dashboard' : 'Back to Home'}</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] tracking-tight">
            Guest Profile & Session Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Persistent guest session. All evaluation responses and saved rooms are encrypted client-side.
          </p>
        </div>

        {session && (
          <button
            onClick={handleResetSession}
            title="Switch Evaluator Nickname"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-black/[0.08] bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Switch Nickname</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Guest Profile & Customization Card */}
        <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Dynamic Avatar */}
              <div
                className={clsx(
                  "flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-3xl font-black text-white shadow-md transition-all",
                  selectedColor
                )}
              >
                {nickname.trim() ? nickname.trim().slice(0, 2).toUpperCase() : 'GU'}
              </div>

              {/* Avatar Color Picker */}
              <div className="space-y-2 flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Choose Avatar Theme Color:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {AVATAR_COLORS.map((colorClass) => {
                    const isSelected = selectedColor === colorClass;
                    return (
                      <button
                        key={colorClass}
                        type="button"
                        onClick={() => setSelectedColor(colorClass)}
                        className={clsx(
                          "h-8 w-8 rounded-full transition-all cursor-pointer flex items-center justify-center shadow-xs",
                          colorClass,
                          isSelected
                            ? "ring-3 ring-black/20 scale-110 shadow-md"
                            : "opacity-80 hover:opacity-100 hover:scale-105"
                        )}
                      >
                        {isSelected && <Check className="h-4 w-4 text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Inputs: Nickname & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1.5">
                  Guest Nickname <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter your evaluator nickname..."
                    className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] p-3 pl-9 text-sm font-semibold focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all"
                  />
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1d1d1f] mb-1.5">
                  Your Role in Evaluation
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.1] bg-[#fbfbfd] p-3 text-sm font-semibold focus:bg-white focus:border-[#0071e3] focus:outline-none transition-all cursor-pointer"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/[0.05]">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Session automatically saved to browser storage</span>
              </div>

              <button
                type="submit"
                className={clsx(
                  "min-h-[44px] px-6 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs active:scale-[0.98]",
                  saveSuccess
                    ? "bg-emerald-600 text-white shadow-emerald-600/20"
                    : "bg-[#0071e3] text-white shadow-blue-500/20 hover:bg-[#0077ed]"
                )}
              >
                {saveSuccess ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Saved Successfully!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Saved Evaluation Rooms */}
        <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-[#1d1d1f] uppercase tracking-wider text-xs text-slate-400">
              My Visited Evaluation Rooms ({userRooms.length})
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
              <Lock className="h-3 w-3 text-emerald-600" />
              AES-256 Encrypted
            </span>
          </div>

          {userRooms.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-black/[0.02] border border-dashed border-black/[0.1] text-xs text-slate-500 space-y-2">
              <DoorOpen className="h-8 w-8 mx-auto text-slate-400 stroke-1" />
              <p className="font-semibold text-slate-700">No rooms in history yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Evaluation rooms you create or join with your Room Code are remembered here so you can re-enter them anytime.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userRooms.map((room) => {
                const isActive = activeRoomCode === room.roomCode;
                const formattedDate = new Date(room.joinedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <div
                    key={room.roomCode}
                    className={clsx(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all",
                      isActive
                        ? "bg-blue-50/60 border-blue-300 shadow-xs"
                        : "bg-white border-black/[0.08] hover:border-black/[0.16]"
                    )}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black tracking-wide text-[#1d1d1f] bg-black/[0.05] px-2 py-0.5 rounded-md">
                          {room.roomCode}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                            Current Active Room
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-bold text-[#1d1d1f] truncate mt-1">
                        {room.groupName || 'Capstone Evaluation'}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {room.titleCount || 3} Titles
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectRoom(room.roomCode)}
                      disabled={isActive}
                      className={clsx(
                        "min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0",
                        isActive
                          ? "bg-blue-100 text-blue-700 cursor-default"
                          : "bg-[#0071e3] text-white hover:bg-[#0077ed] active:scale-[0.98] shadow-xs"
                      )}
                    >
                      <span>{isActive ? 'Current' : 'Enter'}</span>
                      {!isActive && <ArrowRight className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
