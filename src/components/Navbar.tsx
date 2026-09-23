import React, { useState, useRef, useEffect } from 'react';
import { CapstoneTitle, Researcher } from '../types/scoring';
import { calculateTitleSummary } from '../utils/calculator';
import {
  Scale,
  Users,
  Trophy,
  FileText,
  Sparkles,
  ChevronDown,
  RotateCcw,
  Download,
  Upload,
  Settings,
  ShieldAlert,
  Award,
  AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';

interface NavbarProps {
  titles: CapstoneTitle[];
  activeTitleId: string;
  onSelectTitle: (id: string) => void;
  researchers: Researcher[];
  activeResearcherId: string;
  onSelectResearcher: (id: string) => void;
  onOpenLeaderboard: () => void;
  onOpenAdviserReport: () => void;
  onOpenTitleManager: () => void;
  onOpenResearcherManager: () => void;
  onLoadSampleData: () => void;
  onResetData: () => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  titles,
  activeTitleId,
  onSelectTitle,
  researchers,
  activeResearcherId,
  onSelectResearcher,
  onOpenLeaderboard,
  onOpenAdviserReport,
  onOpenTitleManager,
  onOpenResearcherManager,
  onLoadSampleData,
  onResetData,
  onExportJSON,
  onImportJSON
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close actions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setIsActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeTitle = titles.find((t) => t.id === activeTitleId) || titles[0];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-slate-900 sm:text-base">
                Capstone Feasibility
              </span>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black uppercase text-blue-800">
                18-Q Scale
              </span>
            </div>
            <div className="hidden sm:block text-[11px] font-medium text-slate-500">
              Elimination Rubric & Composite Scoring Engine
            </div>
          </div>
        </div>

        {/* Title Selector & Evaluator Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Capstone Title Switcher */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            <select
              value={activeTitleId}
              onChange={(e) => onSelectTitle(e.target.value)}
              className="max-w-[210px] sm:max-w-[280px] truncate bg-transparent px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {titles.map((t, idx) => {
                const summary = calculateTitleSummary(t, activeResearcherId, researchers);
                const tag = summary.isRedLineTriggered
                  ? '🚨 Disqualified'
                  : summary.verdict === 'Approved Finalist'
                  ? '🌟 Approved'
                  : summary.verdict === 'Conditional Backup'
                  ? '⚠️ Backup'
                  : '❌ Discarded';
                return (
                  <option key={t.id} value={t.id}>
                    #{idx + 1}: {t.title.slice(0, 32)}... ({tag})
                  </option>
                );
              })}
            </select>
            <button
              onClick={onOpenTitleManager}
              title="Manage titles"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Evaluator Selector */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            <Users className="h-3.5 w-3.5 text-slate-400 ml-2" />
            <select
              value={activeResearcherId}
              onChange={(e) => onSelectResearcher(e.target.value)}
              className="max-w-[130px] sm:max-w-[170px] truncate bg-transparent px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL_AGGREGATED">👥 Group Consensus (All)</option>
              {researchers.map((r) => (
                <option key={r.id} value={r.id}>
                  👤 {r.name}
                </option>
              ))}
            </select>
            <button
              onClick={onOpenResearcherManager}
              title="Manage researchers"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Compare matrix button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 shadow-sm transition-colors cursor-pointer"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Compare 9 Titles</span>
            <span className="sm:hidden">Matrix</span>
          </button>

          {/* Adviser Report */}
          <button
            onClick={onOpenAdviserReport}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Adviser Report</span>
            <span className="md:hidden">Report</span>
          </button>

          {/* More actions dropdown */}
          <div className="relative" ref={actionsRef}>
            <button
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="More Actions"
            >
              <ChevronDown className="h-4 w-4" />
            </button>

            {isActionsOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in z-50">
                <button
                  onClick={() => {
                    onLoadSampleData();
                    setIsActionsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span>Load Benchmark Sample (9 Titles)</span>
                </button>

                <button
                  onClick={() => {
                    onExportJSON();
                    setIsActionsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4 text-slate-500" />
                  <span>Backup Evaluations (JSON)</span>
                </button>

                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsActionsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Upload className="h-4 w-4 text-slate-500" />
                  <span>Import Evaluations (JSON)</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => {
                    onResetData();
                    setIsActionsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4 text-red-500" />
                  <span>Reset All Data</span>
                </button>
              </div>
            )}
          </div>

          {/* Hidden file input for JSON import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImportJSON}
            accept=".json"
            className="hidden"
          />
        </div>
      </div>
    </header>
  );
};
