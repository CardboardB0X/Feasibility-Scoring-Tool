import React, { useState } from 'react';
import { CapstoneTitle, Researcher } from '../types/scoring';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Settings,
  Users,
  Layers,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import clsx from 'clsx';

interface EditPageProps {
  titles: CapstoneTitle[];
  onSaveTitles: (titles: CapstoneTitle[]) => void;
  researchers: Researcher[];
  onSaveResearchers: (researchers: Researcher[]) => void;
  activeResearcherId: string;
  onSelectResearcher: (id: string) => void;
  onNavigate: (page: any) => void;
}

export const EditPage: React.FC<EditPageProps> = ({
  titles,
  onSaveTitles,
  researchers,
  onSaveResearchers,
  activeResearcherId,
  onSelectResearcher,
  onNavigate
}) => {
  const [localTitles, setLocalTitles] = useState<CapstoneTitle[]>(titles);
  const [localResearchers, setLocalResearchers] = useState<Researcher[]>(researchers);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleTitleChange = (
    id: string,
    field: 'title' | 'description' | 'category',
    val: string
  ) => {
    setLocalTitles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  const handleAddTitle = () => {
    if (localTitles.length >= 9) {
      alert('Maximum of 9 candidate titles allowed.');
      return;
    }
    const newIndex = localTitles.length + 1;
    const newTitle: CapstoneTitle = {
      id: `TITLE-${Date.now()}`,
      title: '',
      description: '',
      category: '',
      createdAt: new Date().toISOString(),
      evaluations: {}
    };
    setLocalTitles((prev) => [...prev, newTitle]);
  };

  const handleRemoveTitle = (id: string) => {
    if (localTitles.length <= 2) {
      alert('You must have at least 2 candidate titles to evaluate.');
      return;
    }
    if (confirm('Delete this title and any evaluations recorded for it?')) {
      setLocalTitles((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleResearcherChange = (id: string, field: 'name' | 'role', val: string) => {
    setLocalResearchers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleAddResearcher = () => {
    const newIdx = localResearchers.length + 1;
    const newResearcher: Researcher = {
      id: `R-${Date.now()}`,
      name: `Evaluator ${newIdx}`,
      role: 'Researcher Evaluator',
      avatarColor: 'bg-[#5856d6]'
    };
    setLocalResearchers((prev) => [...prev, newResearcher]);
  };

  const handleRemoveResearcher = (id: string) => {
    if (localResearchers.length <= 1) {
      alert('You must have at least 1 evaluator profile.');
      return;
    }
    if (confirm('Remove this evaluator?')) {
      setLocalResearchers((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleSaveAll = () => {
    onSaveTitles(localTitles);
    onSaveResearchers(localResearchers);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] pb-24 px-4 sm:px-6 max-w-5xl mx-auto pt-6 selection:bg-[#0071e3] selection:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0071e3] transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-black text-[#1d1d1f] tracking-tight">
            Manage Titles & Evaluators
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure candidate titles (2 to 9) and research team members for this room.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedNotice && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              <span>Saved!</span>
            </span>
          )}

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 rounded-2xl bg-[#0071e3] text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20 hover:bg-[#0077ed] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Section 1: Candidate Titles (2 to 9) */}
        <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#0071e3]">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#1d1d1f]">
                  Candidate Titles ({localTitles.length} of 9 max)
                </h2>
                <p className="text-xs text-slate-500">
                  Minimum 2 titles, maximum 9 titles.
                </p>
              </div>
            </div>

            <button
              onClick={handleAddTitle}
              disabled={localTitles.length >= 9}
              className="flex items-center gap-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-xs font-bold text-slate-700 px-3 py-2 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Title</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {localTitles.map((title, idx) => (
              <div
                key={title.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl border border-black/[0.06] bg-[#fbfbfd]"
              >
                <span className="font-mono text-xs font-bold text-slate-500 bg-black/[0.05] px-2.5 py-1 rounded-lg shrink-0">
                  #{idx + 1}
                </span>

                <div className="flex-1 w-full space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={title.title}
                      onChange={(e) => handleTitleChange(title.id, 'title', e.target.value)}
                      placeholder={`Enter Title #${idx + 1}...`}
                      className="flex-1 rounded-xl border border-black/[0.1] bg-white px-3 py-2 text-xs sm:text-sm font-bold text-[#1d1d1f] focus:border-[#0071e3] focus:outline-none"
                    />

                    <input
                      type="text"
                      value={title.category || ''}
                      onChange={(e) => handleTitleChange(title.id, 'category', e.target.value)}
                      placeholder="Category (e.g. AI, IoT)..."
                      className="sm:w-44 rounded-xl border border-black/[0.1] bg-white px-3 py-2 text-xs font-semibold text-[#0071e3] focus:border-[#0071e3] focus:outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    value={title.description || ''}
                    onChange={(e) => handleTitleChange(title.id, 'description', e.target.value)}
                    placeholder="Brief project scope or objective (optional)..."
                    className="w-full rounded-xl border border-black/[0.08] bg-white px-3 py-1.5 text-xs text-slate-600 focus:border-[#0071e3] focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => handleRemoveTitle(title.id)}
                  title="Delete title"
                  disabled={localTitles.length <= 2}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Research Evaluators */}
        <div className="rounded-[28px] border border-black/[0.08] bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#1d1d1f]">
                  Research Evaluators ({localResearchers.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Team members grading each candidate title.
                </p>
              </div>
            </div>

            <button
              onClick={handleAddResearcher}
              className="flex items-center gap-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-xs font-bold text-slate-700 px-3 py-2 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Evaluator</span>
            </button>
          </div>

          <div className="space-y-3">
            {localResearchers.map((researcher) => (
              <div
                key={researcher.id}
                className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-black/[0.06] bg-[#fbfbfd]"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={clsx(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-white text-xs",
                      researcher.avatarColor || 'bg-[#0071e3]'
                    )}
                  >
                    {researcher.name.slice(0, 2).toUpperCase()}
                  </div>

                  <input
                    type="text"
                    value={researcher.name}
                    onChange={(e) => handleResearcherChange(researcher.id, 'name', e.target.value)}
                    placeholder="Evaluator name..."
                    className="flex-1 rounded-xl border border-black/[0.1] bg-white px-3 py-2 text-xs font-bold text-[#1d1d1f] focus:border-[#0071e3] focus:outline-none"
                  />

                  <input
                    type="text"
                    value={researcher.role || ''}
                    onChange={(e) => handleResearcherChange(researcher.id, 'role', e.target.value)}
                    placeholder="Role (e.g. Lead Dev, Data Eng)..."
                    className="w-40 sm:w-52 rounded-xl border border-black/[0.1] bg-white px-3 py-2 text-xs text-slate-600 focus:border-[#0071e3] focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => handleRemoveResearcher(researcher.id)}
                  disabled={localResearchers.length <= 1}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
