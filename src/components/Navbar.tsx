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
  LayoutGrid,
  CheckCircle2
} from 'lucide-react';
import clsx from 'clsx';

interface NavbarProps {
  titles: CapstoneTitle[];
  activeTitleId: string;
  onSelectTitle: (id: string) => void;
  researchers: Researcher[];
  activeResearcherId: string;
  onSelectResearcher: (id: string) => void;
  onOpenStartMenu: () => void;
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
  onOpenStartMenu,
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setIsActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-white/85 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Brand & Start Menu Launcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenStartMenu}
            title="Open Start Menu (Overview & Titles)"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-3 py-1.5 border border-blue-500/20 text-[#0071e3] hover:bg-blue-500/20 active:scale-[0.98] transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0071e3] text-white shadow-sm group-hover:scale-105 transition-transform">
              <LayoutGrid className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 leading-none">
                Menu
              </div>
              <div className="text-xs font-extrabold text-[#1d1d1f] leading-tight">
                Start Hub
              </div>
            </div>
          </button>

          <div className="h-5 w-px bg-black/[0.08] hidden md:block" />

          {/* Title branding */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-tight text-[#1d1d1f]">
              Capstone Evaluator
            </span>
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
              18 Questions
            </span>
          </div>
        </div>

        {/* Title Selector & Evaluator Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Capstone Title Switcher */}
          <div className="flex items-center rounded-2xl border border-black/[0.08] bg-black/[0.03] p-1">
            <select
              value={activeTitleId}
              onChange={(e) => onSelectTitle(e.target.value)}
              className="max-w-[180px] sm:max-w-[240px] truncate bg-transparent px-2.5 py-1 text-xs font-semibold text-[#1d1d1f] focus:outline-none cursor-pointer"
            >
              {titles.map((t, idx) => {
                const summary = calculateTitleSummary(t, activeResearcherId, researchers);
                const titleText = t.title.trim() ? t.title : `(Untitled Title #${idx + 1})`;
                const tag = summary.isRedLineTriggered
                  ? '🚨 Red Line'
                  : summary.verdict === 'Approved Finalist' && summary.isComplete
                  ? '🌟 Approved'
                  : summary.verdict === 'Conditional Backup' && summary.isComplete
                  ? '⚠️ Backup'
                  : summary.answeredCount > 0
                  ? `(${summary.answeredCount}/18)`
                  : 'Empty';
                return (
                  <option key={t.id} value={t.id}>
                    #{idx + 1}: {titleText.slice(0, 24)} [{tag}]
                  </option>
                );
              })}
            </select>
            <button
              onClick={onOpenTitleManager}
              title="Manage All 9 Titles"
              className="rounded-xl p-1.5 text-slate-500 hover:bg-white hover:text-[#0071e3] transition-colors cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Evaluator Selector */}
          <div className="flex items-center rounded-2xl border border-black/[0.08] bg-black/[0.03] p-1">
            <Users className="h-3.5 w-3.5 text-slate-400 ml-2" />
            <select
              value={activeResearcherId}
              onChange={(e) => onSelectResearcher(e.target.value)}
              className="max-w-[120px] sm:max-w-[160px] truncate bg-transparent px-2 py-1 text-xs font-semibold text-[#1d1d1f] focus:outline-none cursor-pointer"
            >
              <option value="ALL_AGGREGATED">👥 Consensus (All)</option>
              {researchers.map((r) => (
                <option key={r.id} value={r.id}>
                  👤 {r.name}
                </option>
              ))}
            </select>
            <button
              onClick={onOpenResearcherManager}
              title="Manage Research Evaluators"
              className="rounded-xl p-1.5 text-slate-500 hover:bg-white hover:text-[#0071e3] transition-colors cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Reset / Blank button */}
          <button
            onClick={onResetData}
            title="Reset everything to clean blank titles"
            className="flex items-center gap-1.5 rounded-2xl border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50/50 active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-400 group-hover:text-red-500" />
            <span className="hidden sm:inline">Reset Blank</span>
          </button>

          {/* Compare matrix button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 rounded-2xl bg-[#1d1d1f] px-3.5 py-2 text-xs font-semibold text-white hover:bg-black shadow-xs active:scale-[0.98] transition-all cursor-pointer"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Compare Titles</span>
            <span className="sm:hidden">Matrix</span>
          </button>

          {/* Adviser Report */}
          <button
            onClick={onOpenAdviserReport}
            className="flex items-center gap-1.5 rounded-2xl border border-[#0071e3]/30 bg-blue-50/70 px-3.5 py-2 text-xs font-semibold text-[#0071e3] hover:bg-blue-100/70 active:scale-[0.98] transition-all cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Adviser Report</span>
            <span className="md:hidden">Report</span>
          </button>

          {/* More actions dropdown */}
          <div className="relative" ref={actionsRef}>
            <button
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="flex items-center gap-1 rounded-2xl border border-black/[0.08] bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="More Actions"
            >
              <ChevronDown className="h-4 w-4" />
            </button>

            {isActionsOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-black/[0.08] bg-white/95 backdrop-blur-xl p-2 shadow-2xl animate-in fade-in z-50">
                <button
                  onClick={() => {
                    onOpenStartMenu();
                    setIsActionsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-[#0071e3] transition-colors cursor-pointer"
                >
                  <LayoutGrid className="h-4 w-4 text-[#0071e3]" />
                  <span>Open Start Menu</span>
                </button>

                <button
                  onClick={() => {
                    onLoadSampleData();
                    setIsActionsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-purple-600" />
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

                <div className="my-1 border-t border-black/[0.06]" />

                <button
                  onClick={() => {
                    onResetData();
                    setIsActionsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4 text-red-500" />
                  <span>Reset All to Blank</span>
                </button>
              </div>
            )}
          </div>

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
