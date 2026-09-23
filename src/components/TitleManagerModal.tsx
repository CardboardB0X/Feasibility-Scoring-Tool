import React, { useState } from 'react';
import { CapstoneTitle } from '../types/scoring';
import { X, Plus, Trash2, Edit3, Save } from 'lucide-react';

interface TitleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  titles: CapstoneTitle[];
  onSaveTitles: (updatedTitles: CapstoneTitle[]) => void;
  activeTitleId: string;
  onSelectTitle: (titleId: string) => void;
}

export const TitleManagerModal: React.FC<TitleManagerModalProps> = ({
  isOpen,
  onClose,
  titles,
  onSaveTitles,
  activeTitleId,
  onSelectTitle
}) => {
  const [localTitles, setLocalTitles] = useState<CapstoneTitle[]>(titles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('');

  if (!isOpen) return null;

  const handleStartEdit = (t: CapstoneTitle) => {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditDesc(t.description || '');
    setEditCategory(t.category || '');
  };

  const handleSaveEdit = (id: string) => {
    const updated = localTitles.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          title: editTitle.trim() || t.title,
          description: editDesc.trim(),
          category: editCategory.trim()
        };
      }
      return t;
    });
    setLocalTitles(updated);
    onSaveTitles(updated);
    setEditingId(null);
  };

  const handleAddTitle = () => {
    const newId = `TITLE-${Date.now()}`;
    const newTitleObj: CapstoneTitle = {
      id: newId,
      title: '',
      description: '',
      createdAt: new Date().toISOString(),
      evaluations: {}
    };
    const updated = [...localTitles, newTitleObj];
    setLocalTitles(updated);
    onSaveTitles(updated);
    handleStartEdit(newTitleObj);
  };

  const handleDeleteTitle = (id: string) => {
    if (localTitles.length <= 1) {
      alert('You must have at least one capstone title.');
      return;
    }
    if (confirm('Are you sure you want to delete this title and its evaluations?')) {
      const updated = localTitles.filter((t) => t.id !== id);
      setLocalTitles(updated);
      onSaveTitles(updated);
      if (activeTitleId === id) {
        onSelectTitle(updated[0].id);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col max-h-[85vh] w-full max-w-2xl rounded-[28px] bg-white shadow-2xl overflow-hidden border border-black/[0.08] apple-spring">
        {/* macOS Window Chrome Header */}
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-[#fbfbfd]/90 px-6 py-3.5 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e] hover:opacity-80 transition-opacity cursor-pointer"
            />
            <div className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
          </div>

          <div className="text-xs font-semibold text-slate-500 tracking-tight">
            Manage Capstone Titles ({localTitles.length} Titles)
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-black/5 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {localTitles.map((t, index) => {
            const isEditing = editingId === t.id;

            return (
              <div
                key={t.id}
                className="rounded-2xl border border-black/[0.06] p-4 transition-all hover:border-black/[0.12] bg-[#fbfbfd]"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Title Name</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold focus:border-[#0071e3] focus:outline-none bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Category / Domain</label>
                        <input
                          type="text"
                          value={editCategory}
                          placeholder="e.g. IoT, AI, Web, Healthcare"
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-[#0071e3] focus:outline-none bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Scope Description</label>
                        <input
                          type="text"
                          value={editDesc}
                          placeholder="Short summary of project"
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-[#0071e3] focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-black/5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(t.id)}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#0071e3] text-xs font-semibold text-white hover:bg-[#0077ed]"
                      >
                        <Save className="h-3.5 w-3.5" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          #{index + 1}
                        </span>
                        <h4 className="font-bold text-[#1d1d1f] text-sm leading-snug">
                          {t.title}
                        </h4>
                      </div>
                      {t.description && (
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                          {t.description}
                        </p>
                      )}
                      {t.category && (
                        <span className="mt-2 inline-block rounded-md bg-black/5 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          {t.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(t)}
                        title="Edit title details"
                        className="p-1.5 text-slate-400 hover:text-[#0071e3] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTitle(t.id)}
                        title="Delete title"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-black/[0.06] bg-[#fbfbfd] px-6 py-3.5">
          <button
            onClick={handleAddTitle}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-[#0071e3] hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Title</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-[#1d1d1f] px-5 py-2 text-xs font-semibold text-white hover:bg-black transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
