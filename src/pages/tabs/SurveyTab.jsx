import { useState } from 'react';
import { Plus, Trash2, Link2, BarChart2, MessageSquare, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice', icon: '☑️' },
  { value: 'rating', label: 'Rating (1–5)', icon: '⭐' },
  { value: 'open_text', label: 'Open Text', icon: '📝' },
];

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

const SurveyTab = ({ idea }) => {
  const { addSurveyQuestion, deleteSurveyQuestion, addSurveyResponse } = useApp();
  const [showBuilder, setShowBuilder] = useState(false);
  const [showRespond, setShowRespond] = useState(false);
  const [newQ, setNewQ] = useState({ type: 'multiple_choice', text: '', options: ['', ''] });
  const [answers, setAnswers] = useState({});
  const [submittedMsg, setSubmittedMsg] = useState(false);

  const { questions, responses } = idea.survey;

  // Helpers
  const getRatingData = (qId) => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    responses.forEach(r => { if (r.answers[qId]) counts[r.answers[qId]]++; });
    return Object.entries(counts).map(([rating, count]) => ({ rating: `★${rating}`, count }));
  };

  const getMCData = (qId, options) => {
    const counts = {};
    options.forEach(o => { counts[o] = 0; });
    responses.forEach(r => { if (r.answers[qId] && counts[r.answers[qId]] !== undefined) counts[r.answers[qId]]++; });
    return Object.entries(counts).map(([option, count]) => ({ option: option.length > 16 ? option.slice(0, 16) + '…' : option, count }));
  };

  const getOpenTexts = (qId) => responses.map(r => r.answers[qId]).filter(Boolean);

  const handleAddQuestion = () => {
    if (!newQ.text.trim()) return;
    const q = { type: newQ.type, text: newQ.text };
    if (newQ.type === 'multiple_choice') q.options = newQ.options.filter(o => o.trim());
    addSurveyQuestion(idea.id, q);
    setNewQ({ type: 'multiple_choice', text: '', options: ['', ''] });
    setShowBuilder(false);
  };

  const handleSubmitResponse = () => {
    if (Object.keys(answers).length === 0) return;
    addSurveyResponse(idea.id, { answers });
    setAnswers({});
    setSubmittedMsg(true);
    setTimeout(() => { setSubmittedMsg(false); setShowRespond(false); }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-xl text-white">Survey Builder</h3>
          <p className="text-slate-500 text-sm mt-1">{responses.length} responses collected</p>
        </div>
        <div className="flex gap-2">
          {questions.length > 0 && (
            <button onClick={() => setShowRespond(true)} className="btn-secondary">
              <Link2 size={13} /> Simulate Response
            </button>
          )}
          <button onClick={() => setShowBuilder(true)} className="btn-primary">
            <Plus size={14} /> Add Question
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="card text-center py-12 border-dashed border-slate-700">
          <MessageSquare size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No questions yet</p>
          <p className="text-slate-600 text-sm mt-1 mb-4">Add questions to start collecting survey responses.</p>
          <button onClick={() => setShowBuilder(true)} className="btn-primary">
            <Plus size={14} /> Add First Question
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {questions.map((q, qi) => (
            <div key={q.id} className="card">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold text-slate-600 bg-slate-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {qi + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{q.text}</p>
                    <p className="text-xs text-slate-500 mt-0.5 capitalize">{q.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteSurveyQuestion(idea.id, q.id)}
                  className="text-slate-600 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Chart visualization */}
              {responses.length > 0 && (
                <>
                  {q.type === 'rating' && (
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getRatingData(q.id)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <XAxis dataKey="rating" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {getRatingData(q.id).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {q.type === 'multiple_choice' && q.options && (
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getMCData(q.id, q.options)} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                          <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="option" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {getMCData(q.id, q.options).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {q.type === 'open_text' && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {getOpenTexts(q.id).slice(0, 6).map((text, i) => (
                        <p key={i} className="text-xs text-slate-400 bg-slate-800 rounded-lg px-3 py-2">"{text}"</p>
                      ))}
                      {getOpenTexts(q.id).length === 0 && (
                        <p className="text-xs text-slate-600">No open-text responses yet.</p>
                      )}
                    </div>
                  )}
                </>
              )}

              {responses.length === 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <BarChart2 size={13} />
                  Charts will appear once you collect responses.
                </div>
              )}
            </div>
          ))}

          {/* Raw responses count */}
          <div className="card-sm bg-slate-800/40">
            <p className="text-xs text-slate-500 font-medium">
              <Star size={11} className="inline mr-1 text-amber-500" />
              {responses.length} total responses collected
            </p>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      <Modal isOpen={showBuilder} onClose={() => setShowBuilder(false)} title="Add Survey Question">
        <div className="space-y-4">
          <div>
            <label className="label">Question Type</label>
            <div className="grid grid-cols-3 gap-2">
              {QUESTION_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setNewQ(p => ({ ...p, type: t.value }))}
                  className={`p-3 rounded-xl border text-center transition-all ${newQ.type === t.value ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 hover:border-slate-600'}`}
                >
                  <span className="text-xl block mb-1">{t.icon}</span>
                  <span className="text-xs text-slate-300">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Question Text</label>
            <input
              value={newQ.text}
              onChange={e => setNewQ(p => ({ ...p, text: e.target.value }))}
              className="input"
              placeholder="e.g. How often do you experience this problem?"
            />
          </div>
          {newQ.type === 'multiple_choice' && (
            <div>
              <label className="label">Answer Options</label>
              <div className="space-y-2">
                {newQ.options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={opt}
                      onChange={e => setNewQ(p => ({ ...p, options: p.options.map((o, j) => j === i ? e.target.value : o) }))}
                      className="input"
                      placeholder={`Option ${i + 1}`}
                    />
                    {newQ.options.length > 2 && (
                      <button onClick={() => setNewQ(p => ({ ...p, options: p.options.filter((_, j) => j !== i) }))} className="text-slate-500 hover:text-red-400 transition-colors px-2">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {newQ.options.length < 6 && (
                  <button onClick={() => setNewQ(p => ({ ...p, options: [...p.options, ''] }))} className="btn-ghost text-xs">
                    <Plus size={12} /> Add option
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowBuilder(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleAddQuestion} disabled={!newQ.text.trim()} className={`btn-primary flex-1 justify-center ${!newQ.text.trim() ? 'opacity-40 cursor-not-allowed' : ''}`}>
              Add Question
            </button>
          </div>
        </div>
      </Modal>

      {/* Simulate Response Modal */}
      <Modal isOpen={showRespond} onClose={() => setShowRespond(false)} title="Simulate Survey Response">
        {submittedMsg ? (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-emerald-400 font-semibold">Response recorded!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map(q => (
              <div key={q.id}>
                <label className="label">{q.text}</label>
                {q.type === 'rating' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setAnswers(p => ({ ...p, [q.id]: n }))}
                        className={`w-10 h-10 rounded-lg border font-bold text-sm transition-all ${answers[q.id] === n ? 'border-amber-500 bg-amber-500/20 text-amber-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
                {q.type === 'multiple_choice' && q.options && (
                  <div className="space-y-2">
                    {q.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setAnswers(p => ({ ...p, [q.id]: opt }))}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${answers[q.id] === opt ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                {q.type === 'open_text' && (
                  <textarea
                    value={answers[q.id] || ''}
                    onChange={e => setAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                    className="textarea"
                    rows={2}
                    placeholder="Type a response…"
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3">
              <button onClick={() => setShowRespond(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleSubmitResponse} className="btn-primary flex-1 justify-center">Submit Response</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SurveyTab;
