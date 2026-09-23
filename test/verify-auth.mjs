// Node test runner for Authentication logic
import { webcrypto } from 'node:crypto';

// Polyfill window, crypto, and localStorage for Node testing
const storage = {};
globalThis.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

globalThis.window = {
  crypto: webcrypto
};

// Now dynamic import auth utils
const {
  getGuestSession,
  saveGuestSession,
  clearGuestSession,
  addRoomToUserHistory,
  getUserRooms,
  AVATAR_COLORS
} = await import('../src/utils/auth.ts');

console.log('=== RUNNING GUEST AUTHENTICATION & SESSION ENGINE TESTS ===\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// Test 1: Initial state is null
assert(getGuestSession() === null, 'Initial guest session is null prior to login');

// Test 2: Reject empty or whitespace nickname
let threwOnEmpty = false;
try {
  saveGuestSession('   ');
} catch (e) {
  threwOnEmpty = true;
}
assert(threwOnEmpty === true, 'Empty or whitespace nickname throws validation error');

// Test 3: Save valid Guest Session
const session1 = saveGuestSession('Tristen Dev', 'Lead Researcher');
assert(session1 !== null, 'Valid nickname creates guest session');
assert(session1.nickname === 'Tristen Dev', 'Nickname stored accurately');
assert(session1.role === 'Lead Researcher', 'Role stored accurately');
assert(typeof session1.id === 'string' && session1.id.startsWith('GUEST-'), 'Guest ID generated with GUEST- prefix');
assert(AVATAR_COLORS.includes(session1.avatarColor), 'Avatar color picked from valid AVATAR_COLORS');

// Test 4: Persistent session recovery across reloads
const restored = getGuestSession();
assert(restored !== null, 'Session persists in localStorage');
assert(restored?.nickname === 'Tristen Dev', 'Persisted session nickname matches');
assert(restored?.id === session1.id, 'Session ID is preserved across queries');

// Test 5: Update session role and custom avatar color
const updated = saveGuestSession('Tristen Dev', 'Systems Analyst', 'bg-[#34c759]');
assert(updated.id === session1.id, 'Updating profile maintains consistent Guest ID');
assert(updated.role === 'Systems Analyst', 'Updated role persisted');
assert(updated.avatarColor === 'bg-[#34c759]', 'Updated avatar color persisted');

// Test 6: Clear session
clearGuestSession();
assert(getGuestSession() === null, 'clearGuestSession() wipes active session');

// Test 7: Saved Room History Tracking for Guest
const guestId = session1.id;
addRoomToUserHistory(guestId, {
  roomCode: 'CAP-1001',
  groupName: 'AI Diagnosis System',
  roleInRoom: 'Lead Researcher',
  joinedAt: new Date().toISOString(),
  titleCount: 4
});

addRoomToUserHistory(guestId, {
  roomCode: 'CAP-2002',
  groupName: 'Smart Campus IoT',
  roleInRoom: 'Systems Analyst',
  joinedAt: new Date().toISOString(),
  titleCount: 3
});

let rooms = getUserRooms(guestId);
assert(rooms.length === 2, 'Guest has 2 saved rooms');
assert(rooms[0].roomCode === 'CAP-2002', 'Most recently joined room is at index 0');

// Test 8: Re-visiting existing room bumps it to top without duplicates
addRoomToUserHistory(guestId, {
  roomCode: 'CAP-1001',
  groupName: 'AI Diagnosis System (Updated)',
  roleInRoom: 'Lead Researcher',
  joinedAt: new Date().toISOString(),
  titleCount: 4
});

rooms = getUserRooms(guestId);
assert(rooms.length === 2, 'Re-visiting room does not create duplicates');
assert(rooms[0].roomCode === 'CAP-1001', 'Re-visited room bumped to top of history');

console.log(`\n=== GUEST AUTH TESTS SUMMARY: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
