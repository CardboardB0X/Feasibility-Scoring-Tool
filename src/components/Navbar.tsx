import React, { useState, useEffect } from 'react';
import { GuestSession } from '../types/auth';
import { ActivePage } from '../types/navigation';
import { subscribeSyncStatus, CloudSyncStatus } from '../utils/cloudDb';
import {
  Scale,
  LayoutGrid,
  Trophy,
  Play,
  Settings,
  User,
  Menu,
  Cloud,
  Loader2
} from 'lucide-react';
import clsx from 'clsx';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  activeRoomCode: string | null;
  session: GuestSession | null;
  onOpenMobileDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  activeRoomCode,
  session,
  onOpenMobileDrawer
}) => {
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>({
    state: 'idle',
    lastSyncedAt: null,
    message: 'Cloud DB Ready'
  });

  useEffect(() => {
    const unsubscribe = subscribeSyncStatus((status) => {
      setSyncStatus(status);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-white/85 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenMobileDrawer}
            title="Open Menu"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-black/[0.05] text-slate-700 hover:bg-black/[0.09] active:scale-95 transition-all cursor-pointer"
          >
            <Menu className="h-4 w-4" />
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer group text-left"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0071e3] to-[#47a3ff] text-white shadow-sm group-hover:scale-105 transition-transform">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-black text-[#1d1d1f] tracking-tight leading-tight">
                Capstone Evaluator
              </div>
              <div className="text-[10px] font-semibold text-slate-400 leading-none">
                18 Criteria Rubric
              </div>
            </div>
          </button>
        </div>

        {/* Desktop Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl bg-black/[0.04] p-1 border border-black/[0.03] text-xs font-bold">
          <button
            onClick={() => onNavigate('home')}
            className={clsx(
              "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer",
              activePage === 'home'
                ? "bg-white text-[#1d1d1f] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Home
          </button>

          {activeRoomCode && (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className={clsx(
                  "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                  activePage === 'dashboard'
                    ? "bg-white text-[#1d1d1f] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5 text-[#0071e3]" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('questionnaire')}
                className={clsx(
                  "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                  activePage === 'questionnaire'
                    ? "bg-white text-[#1d1d1f] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Play className="h-3.5 w-3.5 text-blue-600 fill-current" />
                <span>Questionnaire</span>
              </button>

              <button
                onClick={() => onNavigate('results')}
                className={clsx(
                  "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                  activePage === 'results'
                    ? "bg-white text-[#1d1d1f] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <span>Results</span>
              </button>

              <button
                onClick={() => onNavigate('edit')}
                className={clsx(
                  "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                  activePage === 'edit'
                    ? "bg-white text-[#1d1d1f] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Settings className="h-3.5 w-3.5 text-slate-500" />
                <span>Edit</span>
              </button>
            </>
          )}

          <button
            onClick={() => onNavigate('account')}
            className={clsx(
              "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1",
              activePage === 'account'
                ? "bg-white text-[#1d1d1f] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <User className="h-3.5 w-3.5 text-purple-600" />
            <span>Profile</span>
          </button>
        </nav>

        {/* Right Action: Cloud Sync Badge & Guest Nickname Pill */}
        <div className="flex items-center gap-2">
          {/* Live Cloud DB Sync Badge */}
          <div
            title={syncStatus.message || 'Encrypted Cloud Database Sync'}
            className={clsx(
              "hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border transition-all select-none",
              syncStatus.state === 'syncing'
                ? "bg-blue-50/80 border-blue-200 text-[#0071e3]"
                : syncStatus.state === 'synced'
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-black/[0.03] border-black/[0.06] text-slate-500"
            )}
          >
            {syncStatus.state === 'syncing' ? (
              <Loader2 className="h-3 w-3 animate-spin text-[#0071e3]" />
            ) : syncStatus.state === 'synced' ? (
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            ) : (
              <Cloud className="h-3 w-3 text-slate-400" />
            )}
            <span className="tracking-tight">
              {syncStatus.state === 'syncing' ? 'Syncing...' : syncStatus.state === 'synced' ? 'Cloud Synced' : 'Cloud DB'}
            </span>
          </div>

          {/* Guest Nickname Pill */}
          {session ? (
            <button
              onClick={() => onNavigate('account')}
              title="Guest Profile & Settings"
              className={clsx(
                "flex items-center gap-2 rounded-2xl border px-3 py-1.5 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]",
                activePage === 'account'
                  ? "border-[#0071e3] bg-blue-50/80 ring-2 ring-blue-500/20"
                  : "border-black/[0.08] bg-white hover:border-black/[0.15]"
              )}
            >
              <div
                className={clsx(
                  "flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black text-white shadow-xs",
                  session.avatarColor || 'bg-[#0071e3]'
                )}
              >
                {session.nickname.slice(0, 1).toUpperCase()}
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-[#1d1d1f] max-w-[110px] truncate">
                  {session.nickname}
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">
                  {session.role}
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('account')}
              className="flex items-center gap-1.5 rounded-2xl border border-black/[0.08] bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs"
            >
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span>Guest User</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
