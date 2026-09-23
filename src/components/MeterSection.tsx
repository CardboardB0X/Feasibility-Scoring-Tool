import React from 'react';
import { MeterDefinition, Question, LikertPoint, MeterScoreDetail } from '../types/scoring';
import { QuestionCard } from './QuestionCard';
import { Cpu, FileCheck2, Scale, Target, CheckCircle, Users } from 'lucide-react';
import clsx from 'clsx';

interface MeterSectionProps {
  meter: MeterDefinition;
  questions: Question[];
  scores: Record<string, LikertPoint>;
  meterScoreDetail?: MeterScoreDetail;
  onScoreChange: (questionId: string, point: LikertPoint) => void;
  readOnly?: boolean;
}

const METER_ICONS = [
  Cpu,          // Meter 1
  FileCheck2,   // Meter 2
  Scale,        // Meter 3
  Target,       // Meter 4
  CheckCircle,  // Meter 5
  Users         // Meter 6
];

export const MeterSection: React.FC<MeterSectionProps> = ({
  meter,
  questions,
  scores,
  meterScoreDetail,
  onScoreChange,
  readOnly = false
}) => {
  const IconComponent = METER_ICONS[meter.id - 1] || Scale;
  const rawScore = meterScoreDetail?.rawAverage || 0;
  const answeredInMeter = questions.filter(q => scores[q.id] !== undefined).length;
  const isMeterComplete = answeredInMeter === questions.length;

  return (
    <section className="mb-10 rounded-3xl border border-slate-200/90 bg-white/95 p-6 md:p-8 shadow-xs backdrop-blur-xs transition-all">
      {/* Meter Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-black text-blue-900 uppercase tracking-wider">
                M{meter.id} • Weight: {meter.weightPercentage}%
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Formula contribution: M_{meter.id} × {(meter.weight).toFixed(2)}
              </span>
            </div>
            <h3 className="mt-1 text-xl font-extrabold text-slate-900 tracking-tight">
              {meter.name}
            </h3>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {meter.description}
            </p>
          </div>
        </div>

        {/* Meter Score Pill */}
        <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 p-3 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Meter Average (M_{meter.id})
            </div>
            <div className="text-xl font-black text-slate-900">
              {rawScore > 0 ? rawScore.toFixed(2) : '—'} <span className="text-xs font-normal text-slate-500">/ 5.00</span>
            </div>
          </div>
          <div
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold font-mono",
              isMeterComplete
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-200 text-slate-700"
            )}
            title={`${answeredInMeter} of ${questions.length} questions answered`}
          >
            {answeredInMeter}/{questions.length}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="mt-6 space-y-6">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            currentValue={scores[question.id]}
            onChange={onScoreChange}
            readOnly={readOnly}
          />
        ))}
      </div>
    </section>
  );
};
