import { GuestSession, UserRoomRecord } from '../types/auth';

const STORAGE_GUEST_SESSION = 'capstone_guest_session_v1';
const STORAGE_GUEST_ROOMS = 'capstone_guest_rooms_v1';

export const AVATAR_COLORS = [
  'bg-[#0071e3]', // Apple Blue
  'bg-[#34c759]', // Emerald Green
  'bg-[#af52de]', // Purple
  'bg-[#ff9500]', // Vibrant Orange
  'bg-[#00c7be]', // Teal
  'bg-[#ff2d55]', // Coral Red
  'bg-[#5856d6]'  // Indigo
];

/**
 * Retrieves the currently active Guest Session from local storage.
 */
export function getGuestSession(): GuestSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_GUEST_SESSION);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.nickname && parsed.nickname.trim()) {
        return parsed;
      }
    }
  } catch (e) {}
  return null;
}

// Alias for backward compatibility
export const getActiveSession = getGuestSession;

/**
 * Saves or updates a Guest Session with the given mandatory nickname.
 */
export function saveGuestSession(
  nickname: string,
  role: string = 'Researcher Evaluator',
  avatarColor?: string
): GuestSession {
  const trimmed = nickname.trim();
  if (!trimmed) {
    throw new Error('A nickname is required to participate in evaluations.');
  }

  const existing = getGuestSession();
  const session: GuestSession = {
    id: existing?.id || `GUEST-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    nickname: trimmed,
    role: role.trim() || 'Researcher Evaluator',
    avatarColor: avatarColor || existing?.avatarColor || AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    createdAt: existing?.createdAt || new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_GUEST_SESSION, JSON.stringify(session));
  } catch (e) {}

  return session;
}

/**
 * Clears the active Guest Session.
 */
export function clearGuestSession(): void {
  try {
    localStorage.removeItem(STORAGE_GUEST_SESSION);
  } catch (e) {}
}

// Alias for backward compatibility
export const logoutUser = clearGuestSession;

/**
 * Saves a room to the guest's recent room history.
 */
export function addRoomToUserHistory(
  userId: string,
  roomRecord: UserRoomRecord
): void {
  try {
    const key = `${STORAGE_GUEST_ROOMS}_${userId}`;
    const raw = localStorage.getItem(key);
    let rooms: UserRoomRecord[] = raw ? JSON.parse(raw) : [];

    // Filter duplicates and prepend
    rooms = [roomRecord, ...rooms.filter((r) => r.roomCode !== roomRecord.roomCode)].slice(0, 10);
    localStorage.setItem(key, JSON.stringify(rooms));
  } catch (e) {}
}

/**
 * Retrieves all saved rooms for the guest.
 */
export function getUserRooms(userId: string): UserRoomRecord[] {
  try {
    const key = `${STORAGE_GUEST_ROOMS}_${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}
