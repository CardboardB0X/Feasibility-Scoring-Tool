// Node test runner for Cloud Database Operations
import { webcrypto } from 'node:crypto';

// Polyfill localStorage and window for Node environment
const storage = {};
globalThis.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

const {
  subscribeSyncStatus,
  saveRoomToDatabase,
  fetchRoomFromDatabase,
  saveUserToDatabase,
  fetchUserFromDatabase
} = await import('../src/utils/cloudDb.ts');

console.log('=== RUNNING CLOUD DATABASE UNIT TESTS ===\n');

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

// Test 1: Subscribe to sync status
let receivedStatus = null;
const unsubscribe = subscribeSyncStatus((status) => {
  receivedStatus = status;
});

assert(receivedStatus !== null, 'Sync subscriber receives initial state');
assert(typeof receivedStatus.state === 'string', 'Initial sync state is a valid string');

// Test 2: Local & cloud room persistence
const testRoomCode = 'CAP-TEST';
const testPayload = JSON.stringify({
  iv: 'dGVzdElW',
  ciphertext: 'dGVzdENpcGhlcnRleHQ=',
  version: 1
});

const saveResult = await saveRoomToDatabase(testRoomCode, testPayload);
assert(saveResult === true, 'saveRoomToDatabase returns true');

// Test 3: Local storage caching for zero-latency retrieval
const cached = localStorage.getItem(`capstone_cloud_room_CAPTEST`);
assert(cached !== null, 'Room payload is cached in localStorage');
assert(JSON.parse(cached).encryptedPayload === testPayload, 'Cached payload matches original');

// Test 4: fetchRoomFromDatabase retrieves the saved room
const retrievedRoomPayload = await fetchRoomFromDatabase(testRoomCode);
assert(retrievedRoomPayload === testPayload, 'fetchRoomFromDatabase returns the stored encrypted payload');

// Test 5: Fetch non-existent room returns null
const missingRoom = await fetchRoomFromDatabase('CAP-NONEXISTENT-999');
assert(missingRoom === null, 'fetchRoomFromDatabase returns null for non-existent code');

// Test 6: User Account Cloud Persistence
const testEmail = 'researcher@university.edu';
const testUserPayload = JSON.stringify({
  iv: 'dXNlcklW',
  ciphertext: 'dXNlckNpcGhlcnRleHQ=',
  version: 1
});

const saveUserResult = await saveUserToDatabase(testEmail, testUserPayload);
assert(saveUserResult === true, 'saveUserToDatabase returns true');

const retrievedUserPayload = await fetchUserFromDatabase(testEmail);
assert(retrievedUserPayload === testUserPayload, 'fetchUserFromDatabase returns stored user payload');

// Cleanup subscriber
unsubscribe();

console.log(`\n=== CLOUD DB TESTS SUMMARY: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
