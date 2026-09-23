import React, { useState } from 'react';
import { Researcher } from '../types/scoring';
import { KeyRound, Copy, Check, Lock, Users, RefreshCw, LogOut, Share2 } from 'lucide-react';
import clsx from 'clsx';

interface RoomHeaderProps {
  roomCode: string;
  researchers: Researcher[];
  activeResearcherId: string;
  isSyncing: boolean;
  onSync: () => void;
  onExitRoom: () => void;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  roomCode,
  researchers,
  activeResearcherId,
  isSyncing,
  onSync,
  onExitRoom
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#code=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="mb-6 rounded-2xl border border-black/[0.06] bg-white/90 backdrop-blur-xl p-3 sm:p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Room Code Badge */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200/80 px-3 py-1 text-xs text-[#0071e3]">
            <KeyRound className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Room:</span>
            <span className="font-mono font-black text-sm">{roomCode}</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 rounded-lg border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Copy Room Code to share with team"
          >
            {copiedCode ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-400" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 rounded-lg border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Copy Direct Invite Link"
          >
            {copiedLink ? <Check className="h-3 w-3 text-emerald-600" /> : <Share2 className="h-3 w-3 text-slate-400" />}
            <span className="hidden sm:inline">{copiedLink ? 'Link Copied' : 'Share Link'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span>AES-256 Encrypted</span>
          </div>
        </div>

        {/* Sync & Exit Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Active evaluators count */}
          <div className="flex items-center gap-1 text-xs text-slate-500 bg-black/[0.03] px-2.5 py-1 rounded-xl">
            <Users className="h-3.5 w-3.5 text-slate-400" />
            <span>{researchers.length} evaluator{researchers.length > 1 ? 's' : ''} in room</span>
          </div>

          {/* Sync Button */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            title="Sync latest scores from cloud"
          >
            <RefreshCw className={clsx("h-3 w-3 text-slate-500", isSyncing && "animate-spin text-[#0071e3]")} />
            <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>

          {/* Exit Room Button */}
          <button
            onClick={onExitRoom}
            className="flex items-center gap-1 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 transition-colors cursor-pointer text-xs"
            title="Exit Room to Start Menu"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
