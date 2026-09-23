import React, { useState } from 'react';
import { Researcher } from '../types/scoring';
import { X, UserPlus, Trash2, Edit2, Check, Users } from 'lucide-react';

interface ResearcherManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchers: Researcher[];
  onSaveResearchers: (researchers: Researcher[]) => void;
  activeResearcherId: string;
  onSelectResearcher: (id: string) => void;
}

export const ResearcherManagerModal: React.FC<ResearcherManagerModalProps> = ({
  isOpen,
  onClose,
  researchers,
  onSaveResearchers,
  activeResearcherId,
  onSelectResearcher
}) => {
  const [list, setList] = useState<Researcher[]>(researchers);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newName.trim()) return;
    const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600', 'bg-rose-600', 'bg-cyan-600'];
    const newR: Researcher = {
      id: `R${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || 'Team Member',
      avatarColor: colors[list.length % colors.length]
    };
    const updated = [...list, newR];
    setList(updated);
    onSaveResearchers(updated);
    setNewName('');
    setNewRole('');
  };

  const handleStartEdit = (r: Researcher) => {
    setEditingId(r.id);
    setEditName(r.name);
    setEditRole(r.role || '');
  };

  const handleSaveEdit = (id: string) => {
    const updated = list.map((r) =>
      r.id === id ? { ...r, name: editName.trim() || r.name, role: editRole.trim() } : r
    );
    setList(updated);
    onSaveResearchers(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (list.length <= 1) {
      alert('You must have at least one researcher evaluator.');
      return;
    }
    const updated = list.filter((r) => r.id !== id);
    setList(updated);
    onSaveResearchers(updated);
    if (activeResearcherId === id) {
      onSelectResearcher(updated[0].id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative flex flex-col max-h-[85vh] w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-900">Manage Researchers</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Each researcher can evaluate titles independently. Remember: <strong>If ANY researcher selects [1] on Q1, Q4, or Q5</strong>, the title is flagged with the Red Line immediate disqualification!
          </p>

          {/* List of current researchers */}
          <div className="space-y-2">
            {list.map((r) => {
              const isEditing = editingId === r.id;

              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-3 bg-white hover:border-slate-300"
                >
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Researcher Name"
                        className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold focus:outline-none focus:border-blue-600 flex-1"
                      />
                      <input
                        type="text"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        placeholder="Role / Specialization"
                        className="rounded-lg border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-600 flex-1"
                      />
                      <button
                        onClick={() => handleSaveEdit(r.id)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full ${r.avatarColor || 'bg-blue-600'} text-white font-bold text-xs flex items-center justify-center`}>
                          {r.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{r.name}</div>
                          <div className="text-[11px] text-slate-500">{r.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(r)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add new researcher */}
          <div className="rounded-2xl border border-dashed border-slate-300 p-4 bg-slate-50/50">
            <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
              <UserPlus className="h-3.5 w-3.5 text-blue-600" />
              Add New Researcher Evaluator
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name (e.g. Maria Clara)"
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-600"
              />
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Role (e.g. Lead Dev)"
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-600"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="mt-3 w-full rounded-xl bg-blue-600 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Add Researcher
            </button>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
