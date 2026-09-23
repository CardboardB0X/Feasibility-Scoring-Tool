import React from 'react';
import { AuthSession, UserRoomRecord } from '../types/auth';
import { getUserRooms } from '../utils/auth';
import {
  X,
  User,
  Mail,
  ShieldCheck,
  DoorOpen,
  LogOut,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import clsx from 'clsx';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: AuthSession | null;
  onLogout: () => void;
  onSelectRoom: (roomCode: string) => void;
  activeRoomCode?: string | null;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  session,
  onLogout,
  onSelectRoom,
  activeRoomCode
}) => {
  if (!isOpen || !session) return null;

  const user = session.user;
  const userRooms = getUserRooms(user.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col max-h-[90vh] w-full max-w-lg rounded-[28px] bg-white shadow-2xl border border-black/[0.08] overflow-hidden apple-spring">
        {/* macOS Titlebar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-black/[0.06] bg-[#fbfbfd]/90 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:opacity-80 transition-opacity cursor-pointer"
            />
            <div className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
          </div>

          <div className="text-xs font-semibold text-slate-500 tracking-tight flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-[#0071e3]" />
            <span>Researcher Account</span>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-black/5 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          {/* User Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f5f5f7] border border-black/[0.04]">
            <div
              className={clsx(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white shadow-sm",
                user.avatarColor || 'bg-[#0071e3]'
              )}
            >
              {user.name.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-extrabold text-[#1d1d1f] tracking-tight truncate">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3 w-3 shrink-0" />
                <span>{user.email}</span>
              </p>
              <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 text-[11px] font-bold text-[#0071e3]">
                <ShieldCheck className="h-3 w-3" />
                <span>{user.role}</span>
              </div>
            </div>
          </div>

          {/* Saved / Joined Rooms Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                My Evaluation Rooms ({userRooms.length})
              </h4>
              <span className="text-[11px] text-slate-400">
                Encrypted with AES-256
              </span>
            </div>

            {userRooms.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-black/[0.02] border border-dashed border-black/[0.1] text-xs text-slate-500 space-y-2">
                <DoorOpen className="h-8 w-8 mx-auto text-slate-400 stroke-1" />
                <p className="font-semibold text-slate-700">No evaluation rooms joined yet</p>
                <p className="text-[11px] text-slate-400">
                  When you create or join a room with a 6-character code, it will be automatically saved here for 1-click access.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
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
                        "flex items-center justify-between p-3.5 rounded-2xl border transition-all",
                        isActive
                          ? "bg-blue-50/60 border-blue-300/80 shadow-xs"
                          : "bg-white border-black/[0.08] hover:border-black/[0.15] hover:shadow-xs"
                      )}
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black tracking-wide text-[#1d1d1f] bg-black/[0.05] px-2 py-0.5 rounded-md">
                            {room.roomCode}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                              Current Room
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-bold text-[#1d1d1f] truncate mt-1">
                          {room.groupName || 'Capstone Evaluation'}
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Layers className="h-2.5 w-2.5" />
                            {room.titleCount || 3} Titles
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5" />
                            {formattedDate}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectRoom(room.roomCode);
                          onClose();
                        }}
                        disabled={isActive}
                        className={clsx(
                          "min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0",
                          isActive
                            ? "bg-blue-100 text-blue-700 cursor-default"
                            : "bg-[#0071e3] text-white hover:bg-[#0077ed] active:scale-[0.98] shadow-xs"
                        )}
                      >
                        <span>{isActive ? 'Active' : 'Enter'}</span>
                        {!isActive && <ArrowRight className="h-3 w-3" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="min-h-[44px] px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={onClose}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-black/[0.05] hover:bg-black/[0.08] text-xs font-bold text-[#1d1d1f] transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
