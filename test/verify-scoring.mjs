import { METERS, QUESTIONS } from '../src/data/rubric.ts';
import { calculateTitleSummary, detectRedLineViolations } from '../src/utils/calculator.ts';

console.log('=== RUNNING SCORING ENGINE VERIFICATION TESTS ===\n');

let failed = 0;
let passed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// Test 1: Verify weights sum to 1.00 (100%)
const totalWeight = METERS.reduce((acc, m) => acc + m.weight, 0);
assert(Math.abs(totalWeight - 1.00) < 0.0001, `Total meter weights sum to 1.00 (got ${totalWeight})`);

// Test 2: Verify all 18 questions exist and 3 questions per meter
assert(QUESTIONS.length === 18, `Rubric has exactly 18 questions (got ${QUESTIONS.length})`);
METERS.forEach(m => {
  const count = QUESTIONS.filter(q => q.meterId === m.id).length;
  assert(count === 3, `Meter ${m.id} has exactly 3 questions (got ${count})`);
});

// Test 3: Red Line detection on Q1=1
const violationsQ1 = detectRedLineViolations({ Q1: 1, Q2: 5, Q3: 5 });
assert(violationsQ1.length === 1 && violationsQ1[0].questionId === 'Q1', 'Red line detected for Q1=1');

// Test 4: Red Line detection on Q4=1
const violationsQ4 = detectRedLineViolations({ Q4: 1 });
assert(violationsQ4.length === 1 && violationsQ4[0].questionId === 'Q4', 'Red line detected for Q4=1');

// Test 5: Red Line detection on Q5=1
const violationsQ5 = detectRedLineViolations({ Q5: 1 });
assert(violationsQ5.length === 1 && violationsQ5[0].questionId === 'Q5', 'Red line detected for Q5=1');

// Test 6: Non-red line questions with score 1 do NOT trigger red line
const violationsNonRed = detectRedLineViolations({ Q2: 1, Q3: 1, Q6: 1, Q7: 1, Q8: 1 });
assert(violationsNonRed.length === 0, 'Non-red line questions with score 1 do NOT trigger Red Line');

// Test 7: CTS calculation with perfect scores (all 5s)
const mockPerfectTitle = {
  id: 'T-PERFECT',
  title: 'Perfect Capstone',
  createdAt: new Date().toISOString(),
  evaluations: {
    'R1': Object.fromEntries(QUESTIONS.map(q => [q.id, 5]))
  }
};
const summaryPerfect = calculateTitleSummary(mockPerfectTitle, 'R1', [{ id: 'R1', name: 'Dev' }]);
assert(summaryPerfect.cts === 5.00, `Perfect scores yield CTS = 5.00 (got ${summaryPerfect.cts})`);
assert(summaryPerfect.verdict === 'Approved Finalist', `Verdict is Approved Finalist (got ${summaryPerfect.verdict})`);
assert(!summaryPerfect.isRedLineTriggered, 'Red Line is not triggered');

// Test 8: CTS calculation with score 4.00 (Approved Finalist threshold)
const mockThresholdTitle = {
  id: 'T-THRESHOLD',
  title: 'Threshold Capstone',
  createdAt: new Date().toISOString(),
  evaluations: {
    'R1': Object.fromEntries(QUESTIONS.map(q => [q.id, 4]))
  }
};
const summaryThreshold = calculateTitleSummary(mockThresholdTitle, 'R1', [{ id: 'R1', name: 'Dev' }]);
assert(summaryThreshold.cts === 4.00, `Uniform 4s yield CTS = 4.00 (got ${summaryThreshold.cts})`);
assert(summaryThreshold.verdict === 'Approved Finalist', `Verdict is Approved Finalist at 4.00`);

// Test 9: CTS calculation in Conditional Backup range (3.30 to 3.99)
// Let M1=3.5, M2=3.5, M3=3.5, M4=3.5, M5=3.5, M6=3.5 -> CTS = 3.50
const mockConditionalTitle = {
  id: 'T-COND',
  title: 'Conditional Title',
  createdAt: new Date().toISOString(),
  evaluations: {
    'R1': {
      Q1: 3, Q2: 4, Q3: 4, // 3.67
      Q4: 3, Q5: 4, Q6: 4, // 3.67
      Q7: 3, Q8: 3, Q9: 4, // 3.33
      Q10: 3, Q11: 4, Q12: 4, // 3.67
      Q13: 3, Q14: 3, Q15: 4, // 3.33
      Q16: 3, Q17: 4, Q18: 4  // 3.67
    }
  }
};
const summaryCond = calculateTitleSummary(mockConditionalTitle, 'R1', [{ id: 'R1', name: 'Dev' }]);
assert(summaryCond.cts >= 3.30 && summaryCond.cts < 4.00, `CTS is in conditional range (got ${summaryCond.cts})`);
assert(summaryCond.verdict === 'Conditional Backup', `Verdict is Conditional Backup (got ${summaryCond.verdict})`);

// Test 10: Discarded range (< 3.30)
const mockDiscardedTitle = {
  id: 'T-DISC',
  title: 'Discarded Title',
  createdAt: new Date().toISOString(),
  evaluations: {
    'R1': Object.fromEntries(QUESTIONS.map(q => [q.id, 2])) // all 2s
  }
};
const summaryDisc = calculateTitleSummary(mockDiscardedTitle, 'R1', [{ id: 'R1', name: 'Dev' }]);
assert(summaryDisc.cts === 2.00, `Uniform 2s yield CTS = 2.00 (got ${summaryDisc.cts})`);
assert(summaryDisc.verdict === 'Discarded', `Verdict is Discarded (got ${summaryDisc.verdict})`);

// Test 11: High CTS with Red Line violation results in Disqualified
const mockHighCtsWithRedLine = {
  id: 'T-DISQ',
  title: 'High CTS but Red Line',
  createdAt: new Date().toISOString(),
  evaluations: {
    'R1': {
      ...Object.fromEntries(QUESTIONS.map(q => [q.id, 5])),
      Q1: 1 // Q1=1 triggers Red Line!
    }
  }
};
const summaryDisq = calculateTitleSummary(mockHighCtsWithRedLine, 'R1', [{ id: 'R1', name: 'Dev' }]);
assert(summaryDisq.isRedLineTriggered, 'Red Line is triggered');
assert(summaryDisq.verdict === 'Disqualified', `Verdict is Disqualified despite high CTS (got ${summaryDisq.verdict})`);

console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
