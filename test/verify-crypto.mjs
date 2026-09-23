// Node 22 already provides built-in globalThis.crypto with subtle

import {
  generateRoomCode,
  formatRoomCode,
  encryptData,
  decryptData,
  encryptUserData,
  decryptUserData
} from '../src/utils/crypto.ts';

console.log('=== RUNNING ENCRYPTION & ROOM CODE TESTS ===\n');

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    console.log(`✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${msg}`);
    failed++;
  }
}

// 1. Room Code Generation
const code1 = generateRoomCode();
assert(code1.startsWith('CAP-') && code1.length === 8, `Generated room code format: ${code1}`);

const code2 = generateRoomCode();
assert(code1 !== code2, `Generated unique room codes: ${code1} vs ${code2}`);

// 2. Room Code Formatting
assert(formatRoomCode('cap7891') === 'CAP-7891', 'Formats cap7891 to CAP-7891');
assert(formatRoomCode('7891') === '7891', 'Preserves 4 digit input');
assert(formatRoomCode('CAP-1234') === 'CAP-1234', 'Preserves standard format');
assert(formatRoomCode('cap-4a2b') === 'CAP-4A2B', 'Formats lower case with hyphen');

// 3. Room Data AES-256-GCM Encryption & Decryption
const sampleRoomData = {
  roomCode: 'CAP-9922',
  groupName: 'Autonomous Drone Navigation',
  evaluatorCount: 4,
  titles: [
    { id: 'T1', title: 'SLAM-based Indoor Navigation' },
    { id: 'T2', title: 'Computer Vision Optical Flow' }
  ],
  scores: {
    'user-1': { T1: { Q1: 5, Q2: 4 }, T2: { Q1: 3, Q2: 3 } }
  }
};

const encryptedRoomPayload = await encryptData(sampleRoomData, 'CAP-9922');
assert(typeof encryptedRoomPayload === 'string', 'Room encryption produces serialized string');

const parsedPayload = JSON.parse(encryptedRoomPayload);
assert(parsedPayload.iv && typeof parsedPayload.iv === 'string', 'Payload contains base64 IV');
assert(parsedPayload.ciphertext && typeof parsedPayload.ciphertext === 'string', 'Payload contains base64 ciphertext');
assert(parsedPayload.version === 1, 'Payload version is 1');
assert(!encryptedRoomPayload.includes('Autonomous Drone Navigation'), 'Plaintext is not exposed in ciphertext');

const decryptedRoomData = await decryptData(encryptedRoomPayload, 'CAP-9922');
assert(decryptedRoomData.groupName === sampleRoomData.groupName, 'Decrypted groupName matches original');
assert(decryptedRoomData.titles.length === 2, 'Decrypted titles count matches original');
assert(decryptedRoomData.scores['user-1'].T1.Q1 === 5, 'Decrypted scores match original');

// Test decryption failure with wrong room code
let roomDecryptionFailed = false;
try {
  await decryptData(encryptedRoomPayload, 'CAP-0000');
} catch {
  roomDecryptionFailed = true;
}
assert(roomDecryptionFailed, 'Decryption fails with invalid room code');

// 4. User Account AES-256-GCM Encryption & Decryption
const sampleUserProfile = {
  id: 'usr_abc123',
  name: 'Prof. Alan Turing',
  email: 'alan@cambridge.edu',
  role: 'Lead Researcher',
  savedRooms: [
    { roomCode: 'CAP-9922', groupName: 'Autonomous Drone Navigation' }
  ]
};

const userPasswordHash = 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0';
const encryptedUserPayload = await encryptUserData(
  sampleUserProfile,
  sampleUserProfile.email,
  userPasswordHash
);

assert(typeof encryptedUserPayload === 'string', 'User encryption produces serialized string');
assert(!encryptedUserPayload.includes('Prof. Alan Turing'), 'User name is not exposed in ciphertext');

const decryptedUserProfile = await decryptUserData(
  encryptedUserPayload,
  sampleUserProfile.email,
  userPasswordHash
);

assert(decryptedUserProfile.name === 'Prof. Alan Turing', 'Decrypted user name matches original');
assert(decryptedUserProfile.email === 'alan@cambridge.edu', 'Decrypted user email matches original');
assert(decryptedUserProfile.savedRooms.length === 1, 'Decrypted saved rooms match original');

// Test user decryption failure with wrong password hash
let userDecryptionFailed = false;
try {
  await decryptUserData(
    encryptedUserPayload,
    sampleUserProfile.email,
    'wrongpasswordhash00000000000000000000000000000000000000000000000000'
  );
} catch {
  userDecryptionFailed = true;
}
assert(userDecryptionFailed, 'User decryption fails with incorrect password hash');

console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
