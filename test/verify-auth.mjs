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
  hashPassword,
  registerUser,
  loginUser,
  getActiveSession,
  logoutUser,
  addRoomToUserHistory,
  getUserRooms
} = await import('../src/utils/auth.ts');

console.log('=== RUNNING AUTHENTICATION ENGINE UNIT TESTS ===\n');

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

// Test 1: Password hashing via SHA-256
const hash1 = await hashPassword('SecretPass123!');
const hash2 = await hashPassword('SecretPass123!');
const hash3 = await hashPassword('DifferentPass456!');

assert(typeof hash1 === 'string' && hash1.length === 64, 'SHA-256 generates 64-character hex hash');
assert(hash1 === hash2, 'Identical passwords produce identical hashes (deterministic with salt)');
assert(hash1 !== hash3, 'Different passwords produce different hashes');

// Test 2: User Registration
const regResult1 = await registerUser(
  'Maria Santos',
  'maria@university.edu',
  'Password123',
  'Lead Developer'
);

assert(regResult1.success === true, 'User registration succeeds with valid data');
assert(regResult1.user?.name === 'Maria Santos', 'User name stored correctly');
assert(regResult1.user?.role === 'Lead Developer', 'User role stored correctly');
assert(regResult1.user?.passwordHash === hash1 || regResult1.user?.passwordHash?.length === 64, 'Password hash stored securely');

// Test 3: Reject Duplicate Registration
const regResult2 = await registerUser(
  'Maria Copy',
  'MARIA@UNIVERSITY.EDU', // Case-insensitive duplicate
  'AnotherPass',
  'QA & Testing Specialist'
);

assert(regResult2.success === false, 'Duplicate email registration rejected');
assert(regResult2.error?.includes('already exists'), 'Duplicate error message returned');

// Test 4: Auto-login session creation
const session1 = getActiveSession();
assert(session1 !== null, 'Active session created automatically upon registration');
assert(session1?.user.email === 'maria@university.edu', 'Session user email matches registered user');

// Test 5: Logout
logoutUser();
const sessionAfterLogout = getActiveSession();
assert(sessionAfterLogout === null, 'Session cleared upon logout');

// Test 6: Successful Login
const loginResult1 = await loginUser('maria@university.edu', 'Password123');
assert(loginResult1.success === true, 'Login succeeds with correct credentials');
assert(loginResult1.session?.user.name === 'Maria Santos', 'Session user restored correctly');

// Test 7: Failed Login (Wrong Password)
const loginResult2 = await loginUser('maria@university.edu', 'WrongPassword!');
assert(loginResult2.success === false, 'Login fails with incorrect password');
assert(loginResult2.error?.includes('Incorrect password'), 'Correct error message for wrong password');

// Test 8: Failed Login (Non-existent user)
const loginResult3 = await loginUser('unknown@university.edu', 'SomePassword');
assert(loginResult3.success === false, 'Login fails for non-existent user');

// Test 9: User Room History Tracking
const userId = regResult1.user.id;
addRoomToUserHistory(userId, {
  roomCode: 'CAP-1001',
  groupName: 'AI Diagnosis System',
  roleInRoom: 'Lead Developer',
  joinedAt: new Date().toISOString(),
  titleCount: 4
});

addRoomToUserHistory(userId, {
  roomCode: 'CAP-2002',
  groupName: 'Smart Campus IoT',
  roleInRoom: 'Lead Developer',
  joinedAt: new Date().toISOString(),
  titleCount: 3
});

let rooms = getUserRooms(userId);
assert(rooms.length === 2, 'User has 2 saved rooms');
assert(rooms[0].roomCode === 'CAP-2002', 'Most recently added room is at index 0');

// Test 10: Re-joining existing room updates order without duplicating
addRoomToUserHistory(userId, {
  roomCode: 'CAP-1001',
  groupName: 'AI Diagnosis System (Updated)',
  roleInRoom: 'Lead Developer',
  joinedAt: new Date().toISOString(),
  titleCount: 4
});

rooms = getUserRooms(userId);
assert(rooms.length === 2, 'Re-visiting room does not create duplicates');
assert(rooms[0].roomCode === 'CAP-1001', 'Re-visited room bumped to top of history');

console.log(`\n=== AUTH TESTS SUMMARY: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
