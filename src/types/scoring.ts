export type LikertPoint = 1 | 2 | 3 | 4 | 5;

export interface QuestionOption {
  point: LikertPoint;
  label: string;
  description: string;
  isRedLineTrigger?: boolean;
}

export interface Question {
  id: string; // "Q1", "Q2", etc.
  number: number;
  meterId: number;
  meterName: string;
  text: string;
  isRedLineQuestion: boolean;
  redLineWarning?: string;
  options: QuestionOption[];
}

export interface MeterDefinition {
  id: number;
  name: string;
  shortName: string;
  weight: number; // 0.20, 0.15, 0.10
  weightPercentage: number; // 20, 15, 10
  description: string;
  questionIds: string[];
}

export interface Researcher {
  id: string;
  name: string;
  role?: string;
  avatarColor?: string;
}

export type ScoreRecord = Record<string, LikertPoint>; // e.g. { "Q1": 4, "Q2": 5, ... }

export interface CapstoneTitle {
  id: string;
  title: string;
  description?: string;
  category?: string;
  notes?: string;
  createdAt: string;
  // researcherId -> ScoreRecord
  evaluations: Record<string, ScoreRecord>;
}

export interface MeterScoreDetail {
  meterId: number;
  meterName: string;
  shortName: string;
  weight: number;
  weightPercent: number;
  rawAverage: number; // average of the 3 questions (1.00 - 5.00)
  weightedContribution: number; // rawAverage * weight
  questionScores: { questionId: string; score: number }[];
}

export interface RedLineViolation {
  questionId: string;
  questionNumber: number;
  questionText: string;
  researcherId?: string;
  researcherName?: string;
  point: number;
  blockerReason: string;
}

export type FinalVerdict = 'Approved Finalist' | 'Conditional Backup' | 'Discarded' | 'Disqualified';

export interface EvaluationSummary {
  titleId: string;
  titleName: string;
  activeResearcherId: string;
  isAggregated: boolean;
  answeredCount: number;
  totalQuestions: number;
  isComplete: boolean;
  meterScores: MeterScoreDetail[];
  cts: number; // Composite Score (1.00 - 5.00)
  verdict: FinalVerdict;
  isRedLineTriggered: boolean;
  redLineViolations: RedLineViolation[];
}
