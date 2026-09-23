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

const METER_THEMES = [
  { gradient: 'from-[#0071e3] to-[#47a3ff]', bg: 'bg-[#0071e3]/10', text: 'text-[#0071e3]' },
  { gradient: 'from-[#5856d6] to-[#7d7aff]', bg: 'bg-[#5856d6]/10', text: 'text-[#5856d6]' },
  { gradient: 'from-[#af52de] to-[#c67aff]', bg: 'bg-[#af52de]/10', text: 'text-[#af52de]' },
  { gradient: 'from-[#ff9500] to-[#ffb340]', bg: 'bg-[#ff9500]/10', text: 'text-[#ff9500]' },
  { gradient: 'from-[#34c759] to-[#63da81]', bg: 'bg-[#34c759]/10', text: 'text-[#34c759]' },
  { gradient: 'from-[#00c7be] to-[#59ded7]', bg: 'bg-[#00c7be]/10', text: 'text-[#00c7be]' }
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
  const theme = METER_THEMES[meter.id - 1] || METER_THEMES[0];
  const rawScore = meterScoreDetail?.rawAverage || 0;
  const answeredInMeter = questions.filter(q => scores[q.id] !== undefined).length;
  const isMeterComplete = answeredInMeter === questions.length;

  return (
    <section className="mb-8 rounded-[28px] border border-black/[0.07] bg-white/95 backdrop-blur-xl p-6 sm:p-7 shadow-xs apple-spring">
      {/* Meter Header */}
      <div className="flex flex-col gap-4 border-b border-black/[0.05] pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className={clsx(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr text-white shadow-sm",
            theme.gradient
          )}>
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={clsx(
                "rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide",
                theme.bg,
                theme.text
              )}>
                Meter {meter.id} • Weight {meter.weightPercentage}%
              </span>
              <span className="text-xs text-slate-400 font-medium">
                M_{meter.id} × {(meter.weight).toFixed(2)}
              </span>
            </div>
            <h3 className="mt-1 text-lg sm:text-xl font-extrabold text-[#1d1d1f] tracking-tight">
              {meter.name}
            </h3>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl leading-relaxed">
              {meter.description}
            </p>
          </div>
        </div>

        {/* Meter Score Pill */}
        <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-black/[0.03] border border-black/[0.04] p-2.5 self-start md:self-auto">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Meter Average (M_{meter.id})
            </div>
            <div className="text-lg font-black text-[#1d1d1f] font-mono leading-none mt-0.5">
              {rawScore > 0 ? rawScore.toFixed(2) : '—'} <span className="text-xs font-normal text-slate-400">/ 5.00</span>
            </div>
          </div>
          <div
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold font-mono",
              isMeterComplete
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-black/5 text-slate-600"
            )}
            title={`${answeredInMeter} of ${questions.length} questions answered`}
          >
            {answeredInMeter}/{questions.length}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="mt-5 space-y-4">
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
