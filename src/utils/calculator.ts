import { METERS, QUESTIONS } from '../data/rubric';
import {
  CapstoneTitle,
  EvaluationSummary,
  FinalVerdict,
  LikertPoint,
  MeterScoreDetail,
  RedLineViolation,
  Researcher,
  ScoreRecord
} from '../types/scoring';

/**
 * Checks for Red Line violations in a set of scores.
 * Red Line triggers if Q1 == 1, Q4 == 1, or Q5 == 1.
 */
export function detectRedLineViolations(
  scores: ScoreRecord,
  researcher?: Researcher
): RedLineViolation[] {
  const violations: RedLineViolation[] = [];

  const checkItem = (qId: string, qNum: number, reason: string) => {
    if (scores[qId] === 1) {
      const q = QUESTIONS.find((item) => item.id === qId);
      violations.push({
        questionId: qId,
        questionNumber: qNum,
        questionText: q?.text || '',
        researcherId: researcher?.id,
        researcherName: researcher?.name,
        point: 1,
        blockerReason: reason
      });
    }
  };

  checkItem(
    'Q1',
    1,
    'No Programmer Capability: Group cannot build the core engine without external hiring.'
  );
  checkItem(
    'Q4',
    4,
    'Missing / Unobtainable Data: Raw dataset or sensor feed does not exist yet.'
  );
  checkItem(
    'Q5',
    5,
    'Institutional / Legal Clearance Blocker: Complex ethics board or legal MOA takes months.'
  );

  return violations;
}

/**
 * Calculates meter scores and composite score for a single score record.
 */
export function calculateTitleSummary(
  title: CapstoneTitle,
  activeResearcherId: string,
  researchers: Researcher[]
): EvaluationSummary {
  // If activeResearcherId is 'ALL_AGGREGATED', we average across all researchers
  const isAggregated = activeResearcherId === 'ALL_AGGREGATED';
  const researcherIds = Object.keys(title.evaluations || {});

  let consolidatedScores: Record<string, number> = {};
  let allViolations: RedLineViolation[] = [];

  if (isAggregated) {
    if (researcherIds.length === 0) {
      consolidatedScores = {};
    } else {
      // For each question, average the scores across researchers
      QUESTIONS.forEach((q) => {
        const scoresForQ: number[] = [];
        researcherIds.forEach((rId) => {
          const rScores = title.evaluations[rId] || {};
          if (rScores[q.id] !== undefined) {
            scoresForQ.push(rScores[q.id]);
            // If any researcher gave 1 on Q1, Q4, Q5, note red line
            if (
              (q.id === 'Q1' || q.id === 'Q4' || q.id === 'Q5') &&
              rScores[q.id] === 1
            ) {
              const rObj = researchers.find((r) => r.id === rId);
              const exists = allViolations.some(
                (v) => v.questionId === q.id && v.researcherId === rId
              );
              if (!exists) {
                const reason =
                  q.id === 'Q1'
                    ? 'No Programmer Capability'
                    : q.id === 'Q4'
                    ? 'Missing / Unobtainable Data'
                    : 'Institutional / Legal Clearance Blocker';
                allViolations.push({
                  questionId: q.id,
                  questionNumber: q.number,
                  questionText: q.text,
                  researcherId: rId,
                  researcherName: rObj?.name || rId,
                  point: 1,
                  blockerReason: reason
                });
              }
            }
          }
        });

        if (scoresForQ.length > 0) {
          const sum = scoresForQ.reduce((a, b) => a + b, 0);
          consolidatedScores[q.id] = sum / scoresForQ.length;
        }
      });
    }
  } else {
    // Single researcher evaluation
    const singleScores = title.evaluations[activeResearcherId] || {};
    consolidatedScores = { ...singleScores };
    const rObj = researchers.find((r) => r.id === activeResearcherId);
    allViolations = detectRedLineViolations(singleScores, rObj);
  }

  // Calculate Meter averages (M1 through M6)
  const meterScores: MeterScoreDetail[] = METERS.map((meter) => {
    const qScores = meter.questionIds.map((qId) => ({
      questionId: qId,
      score: consolidatedScores[qId] || 0
    }));

    const answered = qScores.filter((qs) => qs.score > 0);
    const rawAverage =
      answered.length > 0
        ? answered.reduce((acc, curr) => acc + curr.score, 0) / answered.length
        : 0;

    const weightedContribution = rawAverage * meter.weight;

    return {
      meterId: meter.id,
      meterName: meter.name,
      shortName: meter.shortName,
      weight: meter.weight,
      weightPercent: meter.weightPercentage,
      rawAverage: Number(rawAverage.toFixed(2)),
      weightedContribution: Number(weightedContribution.toFixed(3)),
      questionScores: qScores
    };
  });

  // Calculate Composite Score (CTS):
  // CTS = (M1 * 0.20) + (M2 * 0.20) + (M3 * 0.20) + (M4 * 0.15) + (M5 * 0.15) + (M6 * 0.10)
  const ctsRaw = meterScores.reduce(
    (sum, m) => sum + m.rawAverage * m.weight,
    0
  );
  const cts = Number(ctsRaw.toFixed(2));

  // Determine Answered Questions Count
  const answeredCount = Object.keys(consolidatedScores).filter(
    (k) => consolidatedScores[k] > 0
  ).length;
  const totalQuestions = QUESTIONS.length;
  const isComplete = answeredCount === totalQuestions;

  // Determine Final Verdict
  let verdict: FinalVerdict;
  const isRedLineTriggered = allViolations.length > 0;

  if (isRedLineTriggered) {
    verdict = 'Disqualified';
  } else if (cts >= 4.0) {
    verdict = 'Approved Finalist';
  } else if (cts >= 3.3) {
    verdict = 'Conditional Backup';
  } else {
    verdict = 'Discarded';
  }

  return {
    titleId: title.id,
    titleName: title.title,
    activeResearcherId,
    isAggregated,
    answeredCount,
    totalQuestions,
    isComplete,
    meterScores,
    cts,
    verdict,
    isRedLineTriggered,
    redLineViolations: allViolations
  };
}

/**
 * Export titles evaluation matrix to CSV
 */
export function exportToCSV(
  titles: CapstoneTitle[],
  activeResearcherId: string,
  researchers: Researcher[]
): string {
  const headers = [
    'Title ID',
    'Capstone Title',
    'Status / Verdict',
    'Composite Score (CTS)',
    'Red Line Triggered',
    'Red Line Details',
    'M1: Tech Stack (20%)',
    'M2: Data & Clearances (20%)',
    'M3: Panel Depth (20%)',
    'M4: Scope Delimitation (15%)',
    'M5: Empirical Rigor (15%)',
    'M6: Team Velocity (10%)',
    ...QUESTIONS.map((q) => `${q.id} (${q.text.slice(0, 25)}...)`)
  ];

  const rows = titles.map((t) => {
    const summary = calculateTitleSummary(t, activeResearcherId, researchers);
    const m1 = summary.meterScores.find((m) => m.meterId === 1)?.rawAverage || 0;
    const m2 = summary.meterScores.find((m) => m.meterId === 2)?.rawAverage || 0;
    const m3 = summary.meterScores.find((m) => m.meterId === 3)?.rawAverage || 0;
    const m4 = summary.meterScores.find((m) => m.meterId === 4)?.rawAverage || 0;
    const m5 = summary.meterScores.find((m) => m.meterId === 5)?.rawAverage || 0;
    const m6 = summary.meterScores.find((m) => m.meterId === 6)?.rawAverage || 0;

    const redLineDetails = summary.redLineViolations
      .map((v) => `${v.questionId}: ${v.blockerReason}`)
      .join('; ');

    const scores = isCSVActiveScores(t, activeResearcherId);

    const qScores = QUESTIONS.map((q) => scores[q.id] || '');

    return [
      `"${t.id}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${summary.verdict}"`,
      summary.cts.toFixed(2),
      summary.isRedLineTriggered ? 'YES' : 'NO',
      `"${redLineDetails.replace(/"/g, '""')}"`,
      m1.toFixed(2),
      m2.toFixed(2),
      m3.toFixed(2),
      m4.toFixed(2),
      m5.toFixed(2),
      m6.toFixed(2),
      ...qScores
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

function isCSVActiveScores(
  title: CapstoneTitle,
  activeResearcherId: string
): Record<string, number> {
  if (activeResearcherId === 'ALL_AGGREGATED') {
    const res: Record<string, number> = {};
    const rIds = Object.keys(title.evaluations || {});
    if (rIds.length === 0) return res;
    QUESTIONS.forEach((q) => {
      const vals: number[] = [];
      rIds.forEach((rId) => {
        if (title.evaluations[rId]?.[q.id] !== undefined) {
          vals.push(title.evaluations[rId][q.id]);
        }
      });
      if (vals.length > 0) {
        res[q.id] = Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
      }
    });
    return res;
  }
  return title.evaluations[activeResearcherId] || {};
}

/**
 * Returns titles sorted by feasibility ranking (highest CTS first, disqualified last).
 */
export function getRankedTitles(
  titles: CapstoneTitle[],
  activeResearcherId: string,
  researchers: Researcher[]
): CapstoneTitle[] {
  return [...titles].sort((a, b) => {
    const summaryA = calculateTitleSummary(a, activeResearcherId, researchers);
    const summaryB = calculateTitleSummary(b, activeResearcherId, researchers);

    if (summaryA.isRedLineTriggered && !summaryB.isRedLineTriggered) return 1;
    if (!summaryA.isRedLineTriggered && summaryB.isRedLineTriggered) return -1;

    return summaryB.cts - summaryA.cts;
  });
}

