import { QUESTIONS } from '../src/data/rubric.ts';
import { calculateTitleSummary, getRankedTitles } from '../src/utils/calculator.ts';

console.log('=== RUNNING MULTI-EVALUATOR ISOLATION & CONSENSUS TESTS ===\n');

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

const evaluators = [
  { id: 'EVAL-ARVIN', name: 'Arvin', role: 'Lead Developer' },
  { id: 'EVAL-TRISTEN', name: 'Tristen', role: 'Data / ML Engineer' }
];

// Arvin gives all 5s
const arvinScores = Object.fromEntries(QUESTIONS.map(q => [q.id, 5]));

// Tristen gives all 3s
const tristenScores = Object.fromEntries(QUESTIONS.map(q => [q.id, 3]));

const title1 = {
  id: 'TITLE-1',
  title: 'AI Smart Irrigation Platform',
  createdAt: new Date().toISOString(),
  evaluations: {
    'EVAL-ARVIN': arvinScores,
    'EVAL-TRISTEN': tristenScores
  }
};

// Test 1: Arvin's isolated score
const arvinSummary = calculateTitleSummary(title1, 'EVAL-ARVIN', evaluators);
assert(arvinSummary.cts === 5.00, 'Arvin isolated CTS is 5.00');
assert(arvinSummary.answeredCount === 18, 'Arvin answered 18 criteria');
assert(arvinSummary.verdict === 'Approved Finalist', 'Arvin verdict is Approved Finalist');

// Test 2: Tristen's isolated score
const tristenSummary = calculateTitleSummary(title1, 'EVAL-TRISTEN', evaluators);
assert(tristenSummary.cts === 3.00, 'Tristen isolated CTS is 3.00');
assert(tristenSummary.answeredCount === 18, 'Tristen answered 18 criteria');
assert(tristenSummary.verdict === 'Discarded', 'Tristen verdict is Discarded');

// Test 3: Consensus aggregation combines both evaluators
const consensusSummary = calculateTitleSummary(title1, 'ALL_AGGREGATED', evaluators);
assert(consensusSummary.cts === 4.00, 'Consensus CTS is exactly arithmetic mean 4.00');
assert(consensusSummary.verdict === 'Approved Finalist', 'Consensus verdict is Approved Finalist at 4.00');
assert(!consensusSummary.isRedLineTriggered, 'Consensus has no red line triggered');

// Test 4: Red Line consensus check when one evaluator flags critical issue
const tristenRedLineScores = { ...tristenScores, Q1: 1 };
const titleWithRedLine = {
  id: 'TITLE-2',
  title: 'Autonomous Drone Navigation',
  createdAt: new Date().toISOString(),
  evaluations: {
    'EVAL-ARVIN': arvinScores,
    'EVAL-TRISTEN': tristenRedLineScores
  }
};

const consensusRedLineSummary = calculateTitleSummary(titleWithRedLine, 'ALL_AGGREGATED', evaluators);
assert(consensusRedLineSummary.isRedLineTriggered, 'Consensus accurately flags Red Line when an evaluator triggers Q1=1');
assert(consensusRedLineSummary.verdict === 'Disqualified', 'Consensus verdict is Disqualified');

// Test 5: Side-by-side title ranking
const ranked = getRankedTitles([titleWithRedLine, title1], 'ALL_AGGREGATED', evaluators);
assert(ranked[0].id === 'TITLE-1', 'Clean title ranked #1 above disqualified title');
assert(ranked[1].id === 'TITLE-2', 'Disqualified title ranked #2 below clean title');

console.log(`\n=== MULTI-EVALUATOR TESTS SUMMARY: ${passed} passed, ${failed} failed ===`);
if (failed > 0) process.exit(1);
