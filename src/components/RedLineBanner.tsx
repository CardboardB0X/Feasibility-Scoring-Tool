import React from 'react';
import { AlertOctagon, ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';
import { RedLineViolation } from '../types/scoring';

interface RedLineBannerProps {
  violations: RedLineViolation[];
}

export const RedLineBanner: React.FC<RedLineBannerProps> = ({ violations }) => {
  if (!violations || violations.length === 0) return null;

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border-2 border-red-500/80 bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 p-6 shadow-xl shadow-red-950/5 transition-all">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30 animate-pulse">
          <AlertOctagon className="h-8 w-8" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
              <ShieldAlert className="h-3.5 w-3.5" />
              The Red Line Triggered
            </span>
            <span className="text-xs font-bold text-red-900 uppercase tracking-wide">
              Immediate Disqualification
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-red-950 tracking-tight">
            This Capstone Title Is Dropped Immediately
          </h3>

          <p className="mt-1 text-sm text-red-800 leading-relaxed">
            Per the research committee elimination rules: If any researcher selects score <strong>[1]</strong> on 
            <strong> Q1 (Programming Capability)</strong>, <strong>Q4 (Data Access)</strong>, or <strong>Q5 (Institutional/Legal Clearance)</strong>, 
            the project cannot be completed and must not be presented to the thesis panel.
          </p>

          <div className="mt-4 space-y-2">
            {violations.map((violation, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-red-200 bg-white/90 p-3.5 shadow-xs backdrop-blur-sm"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold text-red-950">
                    {violation.questionId} (Score: {violation.point})
                    {violation.researcherName && ` • Evaluated by ${violation.researcherName}`}:
                  </span>{' '}
                  <span className="text-red-900 font-medium">{violation.blockerReason}</span>
                  <div className="mt-1 text-xs text-slate-500 italic">
                    "{violation.questionText}"
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-red-900">
            <span className="flex items-center gap-1">
              <ArrowRight className="h-3.5 w-3.5 text-red-600" />
              Recommended action:
            </span>
            <span>Switch to an approved finalist title or fundamentally redesign the project architecture.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
