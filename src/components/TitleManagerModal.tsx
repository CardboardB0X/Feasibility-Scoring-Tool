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
      title: `Proposed Title ${localTitles.length + 1}`,
      description: 'Enter scope and research objectives...',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex flex-col max-h-[85vh] w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Manage Capstone Titles</h2>
            <p className="text-xs text-slate-500">Edit title names, descriptions, or add new titles for evaluation</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {localTitles.map((t, index) => {
            const isEditing = editingId === t.id;

            return (
              <div
                key={t.id}
                className="rounded-2xl border border-slate-200 p-4 transition-all hover:border-slate-300 bg-white"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Title Name</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-semibold focus:border-blue-600 focus:outline-none"
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
                          className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700">Scope Description</label>
                        <input
                          type="text"
                          value={editDesc}
                          placeholder="Short summary of project"
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-slate-300 p-2 text-xs focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(t.id)}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700"
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
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">
                          {t.title}
                        </h4>
                      </div>
                      {t.description && (
                        <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                          {t.description}
                        </p>
                      )}
                      {t.category && (
                        <span className="mt-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {t.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleStartEdit(t)}
                        title="Edit title details"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTitle(t.id)}
                        title="Delete title"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={handleAddTitle}
            className="flex items-center gap-1.5 rounded-xl border border-blue-300 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Title</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
