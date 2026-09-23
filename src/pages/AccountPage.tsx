import React from 'react';
import { AuthSession } from '../types/auth';
import { getUserRooms } from '../utils/auth';
import {
  User,
  Mail,
  ShieldCheck,
  DoorOpen,
  LogOut,
  LogIn,
  Calendar,
  Layers,
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  Trash2
} from 'lucide-react';
import clsx from 'clsx';

interface AccountPageProps {
  session: AuthSession | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSelectRoom: (roomCode: string) => void;
  activeRoomCode: string | null;
  onNavigate: (page: any) => void;
  onClearAllData?: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  session,
  onOpenAuth,
  onLogout,
  onSelectRoom,
  activeRoomCode,
  onNavigate,
  onClearAllData
}) => {
  const user = session?.user;
  const userRooms = user ? getUserRooms(user.id) : [];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] pb-24 px-4 sm:px-6 max-w-4xl mx-auto pt-6 selection:bg-[#0071e3] selection:text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0071e3] transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] tracking-tight">
            Researcher Account & Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your evaluation profile and review your saved evaluation rooms.
          </p>
        </div>

        {session && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xs">
          {session ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div
                className={clsx(
                  "flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-2xl font-black text-white shadow-md",
                  user?.avatarColor || 'bg-[#0071e3]'
                )}
              >
                {user?.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-[#1d1d1f] truncate">
                    {user?.name}
                  </h2>
                  <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-0.5 text-xs font-bold text-[#0071e3]">
                    {user?.role}
                  </span>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{user?.email}</span>
                </p>

                <p className="text-[11px] text-slate-400">
                  Account synchronized with browser storage & cloud KV database.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0071e3]">
                <User className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#1d1d1f]">Guest Mode Active</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Create an account or sign in to save your evaluation rooms and resume them from any browser session.
                </p>
              </div>
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#0071e3] text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-[#0077ed] transition-all cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In or Create Account</span>
              </button>
            </div>
          )}
        </div>

        {/* Saved Evaluation Rooms */}
        <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#1d1d1f] uppercase tracking-wider text-xs text-slate-400">
              My Saved Evaluation Rooms ({userRooms.length})
            </h3>
            <span className="text-[11px] text-slate-400">
              Encrypted AES-256
            </span>
          </div>

          {userRooms.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-black/[0.02] border border-dashed border-black/[0.1] text-xs text-slate-500 space-y-2">
              <DoorOpen className="h-8 w-8 mx-auto text-slate-400 stroke-1" />
              <p className="font-semibold text-slate-700">No saved evaluation rooms yet</p>
              <p className="text-[11px] text-slate-400">
                When you create or join rooms with a 6-character code while signed in, they will be cataloged here for instant 1-click access.
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

        {/* Data Management & Danger Zone */}
        {onClearAllData && (
          <div className="rounded-[28px] border border-red-200 bg-red-50/40 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-red-700">
              <Trash2 className="h-4 w-4" />
              <h3 className="text-xs font-black uppercase tracking-wider">
                Data Management & Reset Slate
              </h3>
            </div>
            <p className="text-xs text-red-900/80 leading-relaxed">
              Need to clear all evaluation data? This will wipe your active room, local evaluations, cached accounts, and reset the entire app to a 100% empty slate.
            </p>
            <div className="pt-1">
              <button
                onClick={onClearAllData}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white px-4 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All Data & Reset App</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
