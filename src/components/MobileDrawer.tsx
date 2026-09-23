import React from 'react';
import { GuestSession } from '../types/auth';
import { ActivePage } from '../types/navigation';
import {
  X,
  User,
  DoorOpen,
  LayoutGrid,
  Trophy,
  Play,
  Settings,
  Lock,
  Copy,
  Check,
  Home
} from 'lucide-react';
import clsx from 'clsx';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  session: GuestSession | null;
  activeRoomCode: string | null;
  titleCount: number;
  researcherCount: number;
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onExitRoom: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  session,
  activeRoomCode,
  titleCount,
  researcherCount,
  activePage,
  onNavigate,
  onExitRoom
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    if (activeRoomCode) {
      navigator.clipboard.writeText(activeRoomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNav = (page: ActivePage) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer panel */}
      <div className="relative flex flex-col w-full max-w-xs sm:max-w-sm h-full bg-white/95 backdrop-blur-2xl shadow-2xl border-l border-black/[0.08] overflow-hidden apple-spring">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06] bg-[#fbfbfd]">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="text-xs font-bold text-slate-700 ml-1">Menu & Navigation</span>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-black/5 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Guest Nickname Section */}
          <div className="rounded-2xl border border-black/[0.08] bg-[#f5f5f7]/80 p-4">
            {session ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={clsx(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white shadow-xs",
                      session.avatarColor || 'bg-[#0071e3]'
                    )}
                  >
                    {session.nickname.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-extrabold text-[#1d1d1f] truncate">
                      {session.nickname}
                    </h4>
                    <span className="inline-block mt-0.5 text-[10px] font-bold text-[#0071e3] bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-md">
                      {session.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleNav('account')}
                  className="w-full min-h-[40px] flex items-center justify-center gap-1.5 rounded-xl bg-white border border-black/[0.08] text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <User className="h-3.5 w-3.5 text-[#0071e3]" />
                  <span>Edit Nickname & Profile</span>
                </button>
              </div>
            ) : (
              <div className="text-center space-y-2 py-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#0071e3]">
                  <User className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-extrabold text-[#1d1d1f]">Guest Evaluator</h4>
                <p className="text-[11px] text-slate-500">
                  Enter a nickname when creating or joining a room.
                </p>
              </div>
            )}
          </div>

          {/* Active Room Card */}
          {activeRoomCode && (
            <div className="rounded-2xl border border-black/[0.08] bg-white p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Active Room
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  <Lock className="h-2.5 w-2.5 text-emerald-600" />
                  AES-256
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-black/[0.03] p-2.5 border border-black/[0.04]">
                <div>
                  <div className="font-mono text-base font-black tracking-widest text-[#1d1d1f]">
                    {activeRoomCode}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {titleCount} Titles &bull; {researcherCount} Evaluator{researcherCount !== 1 ? 's' : ''}
                  </div>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="min-h-[40px] px-3 flex items-center gap-1 rounded-lg bg-white border border-black/[0.08] text-xs font-bold text-slate-700 hover:text-[#0071e3] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Main Pages Navigation */}
          <div className="space-y-1.5">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
              Pages
            </span>

            <button
              onClick={() => handleNav('home')}
              className={clsx(
                "w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left",
                activePage === 'home'
                  ? "bg-blue-50 text-[#0071e3] font-bold"
                  : "text-[#1d1d1f] hover:bg-black/[0.04]"
              )}
            >
              <Home className="h-4 w-4" />
              <div className="flex-1">
                <div>Homepage</div>
                <div className="text-[10px] text-slate-400">New room or code join</div>
              </div>
            </button>

            {activeRoomCode && (
              <>
                <button
                  onClick={() => handleNav('dashboard')}
                  className={clsx(
                    "w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left",
                    activePage === 'dashboard'
                      ? "bg-blue-50 text-[#0071e3] font-bold"
                      : "text-[#1d1d1f] hover:bg-black/[0.04]"
                  )}
                >
                  <LayoutGrid className="h-4 w-4 text-[#0071e3]" />
                  <div className="flex-1">
                    <div>Dashboard</div>
                    <div className="text-[10px] text-slate-400">Candidate titles & overview</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNav('questionnaire')}
                  className={clsx(
                    "w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left",
                    activePage === 'questionnaire'
                      ? "bg-blue-50 text-[#0071e3] font-bold"
                      : "text-[#1d1d1f] hover:bg-black/[0.04]"
                  )}
                >
                  <Play className="h-4 w-4 text-blue-600 fill-current" />
                  <div className="flex-1">
                    <div>Questionnaire</div>
                    <div className="text-[10px] text-slate-400">Quizizz-style flashcard scoring</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNav('results')}
                  className={clsx(
                    "w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left",
                    activePage === 'results'
                      ? "bg-blue-50 text-[#0071e3] font-bold"
                      : "text-[#1d1d1f] hover:bg-black/[0.04]"
                  )}
                >
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <div className="flex-1">
                    <div>Results & Outcomes</div>
                    <div className="text-[10px] text-slate-400">Consolidated matrix & scores</div>
                  </div>
                </button>

                <button
                  onClick={() => handleNav('edit')}
                  className={clsx(
                    "w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left",
                    activePage === 'edit'
                      ? "bg-blue-50 text-[#0071e3] font-bold"
                      : "text-[#1d1d1f] hover:bg-black/[0.04]"
                  )}
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                  <div className="flex-1">
                    <div>Edit Titles & Team</div>
                    <div className="text-[10px] text-slate-400">Configure titles and evaluators</div>
                  </div>
                </button>
              </>
            )}

            <button
              onClick={() => handleNav('account')}
              className={clsx(
                "w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left",
                activePage === 'account'
                  ? "bg-blue-50 text-[#0071e3] font-bold"
                  : "text-[#1d1d1f] hover:bg-black/[0.04]"
              )}
            >
              <User className="h-4 w-4 text-purple-600" />
              <div className="flex-1">
                <div>Profile & Settings</div>
                <div className="text-[10px] text-slate-400">Nickname, avatar, saved rooms</div>
              </div>
            </button>
          </div>

          {/* Room Exit Control */}
          {activeRoomCode && (
            <div className="pt-4 border-t border-black/[0.06]">
              <button
                onClick={() => {
                  onExitRoom();
                  onClose();
                }}
                className="w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-left"
              >
                <DoorOpen className="h-4 w-4 text-slate-500" />
                <div className="flex-1">
                  <div className="font-bold">Switch / Exit Room</div>
                  <div className="text-[10px] text-slate-500">Return to Homepage</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
