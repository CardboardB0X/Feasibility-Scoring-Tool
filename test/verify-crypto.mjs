import { generateRoomCode, formatRoomCode } from '../src/utils/crypto.ts';

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

console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
