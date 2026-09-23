import { User, AuthSession, UserRole, UserRoomRecord } from '../types/auth';
import { encryptUserData, decryptUserData } from './crypto';
import { saveUserToDatabase, fetchUserFromDatabase } from './cloudDb';

const STORAGE_USERS = 'capstone_auth_users_v1';
const STORAGE_SESSION = 'capstone_auth_session_v1';
const PASSWORD_SALT = 'capstone-auth-salt-v1:';

function getCrypto(): SubtleCrypto {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    return window.crypto.subtle;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }
  throw new Error('Web Crypto API is not available.');
}

/**
 * Hashes password using SHA-256 via Web Crypto API.
 */
export async function hashPassword(password: string): Promise<string> {
  const subtle = getCrypto();
  const encoder = new TextEncoder();
  const data = encoder.encode(PASSWORD_SALT + password);
  const hashBuffer = await subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Loads all registered users from storage.
 */
export function getAllUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

/**
 * Saves all registered users to storage.
 */
function saveAllUsers(users: User[]) {
  try {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  } catch (e) {}
}

const AVATAR_COLORS = [
  'bg-[#0071e3]',
  'bg-[#34c759]',
  'bg-[#af52de]',
  'bg-[#ff9500]',
  'bg-[#00c7be]',
  'bg-[#5856d6]'
];

/**
 * Register a new user. Encrypts user profile and syncs to cloud database.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<{ success: boolean; user?: User; error?: string }> {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, error: 'A valid email address is required.' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  const users = getAllUsers();
  if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const passwordHash = await hashPassword(password);
  const newUser: User = {
    id: `USER-${Date.now()}`,
    name: trimmedName,
    email: trimmedEmail,
    role,
    passwordHash,
    avatarColor: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
    createdAt: new Date().toISOString(),
    rooms: []
  };

  users.push(newUser);
  saveAllUsers(users);

  // Sync encrypted user record to cloud database
  try {
    const encrypted = await encryptUserData(newUser, trimmedEmail, passwordHash);
    await saveUserToDatabase(trimmedEmail, encrypted);
  } catch (e) {
    console.warn('Could not sync user to cloud database', e);
  }

  // Auto-login
  loginWithUser(newUser);

  return { success: true, user: newUser };
}

/**
 * Log in with email and password.
 * Checks local cache first, then cloud database for multi-device login.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  let user = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  const inputHash = await hashPassword(password);

  // If user not in local storage, check cloud database
  if (!user) {
    try {
      const encryptedCloud = await fetchUserFromDatabase(trimmedEmail);
      if (encryptedCloud) {
        user = await decryptUserData<User>(encryptedCloud, trimmedEmail, inputHash);
        if (user) {
          users.push(user);
          saveAllUsers(users);
        }
      }
    } catch (e) {
      return { success: false, error: 'Incorrect password or unable to decrypt user account.' };
    }
  }

  if (!user) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (inputHash !== user.passwordHash) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  const session = loginWithUser(user);
  return { success: true, session };
}

/**
 * Creates and stores an active session for the user.
 */
export function loginWithUser(user: User): AuthSession {
  const session: AuthSession = {
    token: `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarColor: user.avatarColor
    },
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };

  try {
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(session));
  } catch (e) {}

  return session;
}

/**
 * Returns current authenticated user session if valid.
 */
export function getActiveSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION);
    if (raw) {
      const session: AuthSession = JSON.parse(raw);
      if (new Date(session.expiresAt) > new Date()) {
        return session;
      }
      localStorage.removeItem(STORAGE_SESSION);
    }
  } catch (e) {}
  return null;
}

/**
 * Logs out the active user.
 */
export function logoutUser(): void {
  try {
    localStorage.removeItem(STORAGE_SESSION);
  } catch (e) {}
}

/**
 * Saves a room association to the user's account history and syncs to cloud.
 */
export async function addRoomToUserHistory(
  userId: string,
  roomRecord: UserRoomRecord
): Promise<void> {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const existingRooms = user.rooms || [];
  const filtered = existingRooms.filter((r) => r.roomCode !== roomRecord.roomCode);
  user.rooms = [roomRecord, ...filtered];

  saveAllUsers(users);

  try {
    const encrypted = await encryptUserData(user, user.email, user.passwordHash);
    await saveUserToDatabase(user.email, encrypted);
  } catch (e) {}
}

/**
 * Retrieves the list of rooms associated with the logged-in user.
 */
export function getUserRooms(userId: string): UserRoomRecord[] {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  return user?.rooms || [];
}
