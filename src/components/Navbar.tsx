import React, { useState, useRef, useEffect } from 'react';
import { CapstoneTitle, Researcher } from '../types/scoring';
import { AuthSession } from '../types/auth';
import { ActivePage } from '../types/navigation';
import { subscribeSyncStatus, CloudSyncStatus } from '../utils/cloudDb';
import {
  Scale,
  LayoutGrid,
  Trophy,
  Play,
  Settings,
  User,
  LogIn,
  Menu,
  RotateCcw,
  Download,
  Upload,
  Sparkles,
  ChevronDown,
  Cloud,
  CheckCircle2,
  Loader2,
  Trash2
} from 'lucide-react';
import clsx from 'clsx';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  activeRoomCode: string | null;
  session: AuthSession | null;
  onOpenAuth: () => void;
  onOpenMobileDrawer: () => void;
  onLoadSampleData: () => void;
  onResetData: () => void;
  onClearAllData?: () => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  activeRoomCode,
  session,
  onOpenAuth,
  onOpenMobileDrawer,
  onLoadSampleData,
  onResetData,
  onClearAllData,
  onExportJSON,
  onImportJSON
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>({
    state: 'idle',
    lastSyncedAt: null,
    message: 'Cloud DB Ready'
  });

  const actionsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeSyncStatus((status) => {
      setSyncStatus(status);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setIsActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0071e3] text-white shadow-sm group-hover:scale-105 transition-transform">
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
              "px-3.5 py-1.5 rounded-xl transition-all cursor-pointer",
              activePage === 'account'
                ? "bg-white text-[#1d1d1f] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Account
          </button>
        </nav>

        {/* Right Action Buttons */}
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

          {/* User Account Pill / Button */}
          {session ? (
            <button
              onClick={() => onNavigate('account')}
              title="My Profile & Saved Rooms"
              className={clsx(
                "flex items-center gap-2 rounded-2xl border px-2.5 py-1.5 transition-all cursor-pointer shadow-2xs",
                activePage === 'account'
                  ? "border-[#0071e3] bg-blue-50/70"
                  : "border-black/[0.08] bg-white hover:border-black/[0.15]"
              )}
            >
              <div
                className={clsx(
                  "flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black text-white",
                  session.user.avatarColor || 'bg-[#0071e3]'
                )}
              >
                {session.user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left max-w-[100px] truncate leading-tight">
                <div className="text-xs font-bold text-[#1d1d1f] truncate">
                  {session.user.name}
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate">
                  {session.user.role}
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              title="Sign In or Register"
              className="flex items-center gap-1.5 rounded-2xl bg-[#0071e3] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0077ed] active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          {/* More actions dropdown */}
          <div className="relative" ref={actionsRef}>
            <button
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="flex items-center gap-1 rounded-2xl border border-black/[0.08] bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              title="More Actions"
            >
              <ChevronDown className="h-4 w-4" />
            </button>

            {isActionsOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-black/[0.08] bg-white/95 backdrop-blur-xl p-2 shadow-2xl animate-in fade-in z-50">
                <button
                  onClick={() => {
                    onLoadSampleData();
                    setIsActionsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span>Load Benchmark (9 Titles)</span>
                </button>

                <button
                  onClick={() => {
                    onExportJSON();
                    setIsActionsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4 text-slate-500" />
                  <span>Backup Evaluations (JSON)</span>
                </button>

                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsActionsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Upload className="h-4 w-4 text-slate-500" />
                  <span>Import Evaluations (JSON)</span>
                </button>

                <div className="my-1 border-t border-black/[0.06]" />

                <button
                  onClick={() => {
                    onResetData();
                    setIsActionsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4 text-amber-500" />
                  <span>Reset Evaluations in Room</span>
                </button>

                {onClearAllData && (
                  <button
                    onClick={() => {
                      onClearAllData();
                      setIsActionsOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span>Clear All Data (Wipe Everything)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={onImportJSON}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
    </header>
  );
};
