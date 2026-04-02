import { useState } from 'react';
import { Edit3, Check, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import ValidationBadge, { StatusBadge } from '../../components/ValidationBadge';

const OverviewTab = ({ idea }) => {
  const { updateIdea, deleteIdea } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: idea.title,
    oneLiner: idea.oneLiner,
    category: idea.category,
    pitch: { ...idea.pitch },
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const setPitch = (k) => (e) => setForm(p => ({ ...p, pitch: { ...p.pitch, [k]: e.target.value } }));

  const handleSave = () => {
    updateIdea(idea.id, form);
    setEditing(false);
  };

  const handleDelete = () => {
    deleteIdea(idea.id);
    navigate('/ideas');
  };

  const pitchSections = [
    { key: 'problem', label: '🔴 The Problem', placeholder: 'What pain point does this idea solve?' },
    { key: 'solution', label: '🟢 The Solution', placeholder: 'How does your idea solve it uniquely?' },
    { key: 'targetCustomer', label: '👤 Target Customer', placeholder: 'Who is the primary buyer or user?' },
    { key: 'businessModel', label: '💰 Business Model', placeholder: 'How does it make money?' },
  ];

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{idea.emoji}</span>
            <div>
              {editing ? (
                <input
                  value={form.title}
                  onChange={set('title')}
                  className="input text-xl font-display font-bold mb-2"
                />
              ) : (
                <h2 className="font-display font-bold text-2xl text-white mb-1">{idea.title}</h2>
              )}
              <div className="flex items-center gap-2">
                <StatusBadge status={idea.status} />
                <ValidationBadge score={idea.validationScore} size="sm" />
                <span className="text-xs text-slate-600">{idea.category}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <button onClick={handleSave} className="btn-primary">
                <Check size={13} /> Save
              </button>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-secondary">
                <Edit3 size={13} /> Edit
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="mt-4">
            <label className="label">One-Liner</label>
            <input value={form.oneLiner} onChange={set('oneLiner')} className="input" />
          </div>
        ) : (
          <p className="text-slate-400 mt-4 leading-relaxed">{idea.oneLiner}</p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-800">
          <div>
            <p className="text-xs text-slate-500">Created</p>
            <p className="text-sm text-slate-200 font-medium mt-0.5">{idea.createdAt}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Validation Score</p>
            <p className="text-sm font-bold text-white mt-0.5">{idea.validationScore} / 100</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Call Price</p>
            <p className="text-sm font-bold text-amber-400 mt-0.5">${idea.marketplace.callPrice}</p>
          </div>
        </div>
      </div>

      {/* Pitch sections */}
      {pitchSections.map(({ key, label, placeholder }) => (
        <div key={key} className="card">
          <h4 className="font-display font-semibold text-white mb-3 flex items-center gap-2 text-base">
            {label}
          </h4>
          {editing ? (
            <textarea
              rows={3}
              value={form.pitch[key]}
              onChange={setPitch(key)}
              className="textarea"
              placeholder={placeholder}
            />
          ) : (
            <p className="text-slate-400 text-sm leading-relaxed">
              {idea.pitch[key] || <span className="text-slate-600 italic">{placeholder}</span>}
            </p>
          )}
        </div>
      ))}

      {/* Danger zone */}
      <div className="card border-red-500/20">
        <h4 className="font-display font-semibold text-red-400 mb-3">Danger Zone</h4>
        {confirmDelete ? (
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-400 flex-1">Are you sure? This cannot be undone.</p>
            <button onClick={() => setConfirmDelete(false)} className="btn-secondary text-xs">Cancel</button>
            <button onClick={handleDelete} className="btn-danger text-xs">Delete Permanently</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="btn-danger">
            <Trash2 size={13} /> Delete Idea
          </button>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
