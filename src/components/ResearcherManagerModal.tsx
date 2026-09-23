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
    const colors = ['bg-[#0071e3]', 'bg-[#34c759]', 'bg-[#af52de]', 'bg-[#ff9500]', 'bg-[#ff3b30]', 'bg-[#00c7be]'];
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col max-h-[85vh] w-full max-w-lg rounded-[28px] bg-white shadow-2xl overflow-hidden border border-black/[0.08] apple-spring">
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

          <div className="text-xs font-semibold text-slate-500 tracking-tight flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#0071e3]" />
            <span>Research Team Evaluators</span>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-black/5 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Team members evaluate titles independently. Remember: <strong>If ANY researcher selects [1] on Q1, Q4, or Q5</strong>, the title is dropped with the Red Line immediate disqualification!
          </p>

          <div className="space-y-2">
            {list.map((r) => {
              const isEditing = editingId === r.id;

              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-2xl border border-black/[0.06] p-3 bg-[#fbfbfd] hover:border-black/[0.12]"
                >
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Researcher Name"
                        className="rounded-xl border border-slate-300 px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-[#0071e3] flex-1 bg-white"
                      />
                      <input
                        type="text"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        placeholder="Role / Specialization"
                        className="rounded-xl border border-slate-300 px-2.5 py-1 text-xs focus:outline-none focus:border-[#0071e3] flex-1 bg-white"
                      />
                      <button
                        onClick={() => handleSaveEdit(r.id)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full ${r.avatarColor || 'bg-[#0071e3]'} text-white font-bold text-xs flex items-center justify-center shadow-2xs`}>
                          {r.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#1d1d1f] text-xs">{r.name}</div>
                          <div className="text-[11px] text-slate-500">{r.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(r)}
                          className="p-1.5 text-slate-400 hover:text-[#0071e3] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
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

          <div className="rounded-2xl border border-dashed border-black/[0.12] p-4 bg-black/[0.02]">
            <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
              <UserPlus className="h-3.5 w-3.5 text-[#0071e3]" />
              Add New Researcher Evaluator
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name (e.g. Maria Clara)"
                className="rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-[#0071e3]"
              />
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Role (e.g. Lead Dev)"
                className="rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#0071e3]"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="mt-3 w-full rounded-xl bg-[#0071e3] py-2 text-xs font-semibold text-white hover:bg-[#0077ed] disabled:opacity-50 transition-colors cursor-pointer"
            >
              Add Researcher
            </button>
          </div>
        </div>

        <div className="flex justify-end border-t border-black/[0.06] bg-[#fbfbfd] px-6 py-3.5">
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
