import { useState } from 'react';
import { Mail, Search, Send, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';

const STATUS_OPTS = ['interested', 'hot_lead', 'contacted'];
const STATUS_COLORS = {
  interested: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  hot_lead: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  contacted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};
const STATUS_LABELS = { interested: 'Interested', hot_lead: '🔥 Hot Lead', contacted: 'Contacted' };

const EmailListTab = ({ idea }) => {
  const { updateEmailStatus } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ subject: '', body: '' });
  const [sent, setSent] = useState(false);

  const { emailList } = idea;

  const filtered = emailList.filter(e => {
    const matchSearch = e.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: emailList.length,
    interested: emailList.filter(e => e.status === 'interested').length,
    hot_lead: emailList.filter(e => e.status === 'hot_lead').length,
    contacted: emailList.filter(e => e.status === 'contacted').length,
  };

  const handleSend = () => {
    if (!compose.subject || !compose.body) return;
    setSent(true);
    setTimeout(() => { setSent(false); setShowCompose(false); setCompose({ subject: '', body: '' }); }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-xl text-white">Email List</h3>
          <p className="text-slate-500 text-sm mt-1">{emailList.length} contacts captured</p>
        </div>
        {emailList.length > 0 && (
          <button onClick={() => setShowCompose(true)} className="btn-primary">
            <Send size={13} /> Send Follow-up
          </button>
        )}
      </div>

      {/* Source summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { key: 'all', label: 'Total', icon: Mail },
          { key: 'hot_lead', label: 'Hot Leads', icon: Mail },
          { key: 'interested', label: 'Interested', icon: Mail },
          { key: 'contacted', label: 'Contacted', icon: CheckCircle },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`stat-card text-left transition-all ${filterStatus === key ? 'border-amber-500/30 bg-amber-500/5' : 'hover:border-slate-700'}`}
          >
            <Icon size={13} className={filterStatus === key ? 'text-amber-400' : 'text-slate-500'} />
            <p className="font-display font-bold text-2xl text-white mt-2">{counts[key] ?? 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {emailList.length === 0 ? (
        <div className="card text-center py-12 border-dashed border-slate-700">
          <Mail size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No emails captured yet</p>
          <p className="text-slate-600 text-sm mt-1">Emails are automatically captured when people respond to your survey or submit a pre-order signal.</p>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-8 text-sm" placeholder="Search emails…" />
          </div>

          {/* Table */}
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Source</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3 text-slate-200 font-medium">{e.email}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-slate-800 text-slate-400 border-0 capitalize">
                        {e.source.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={e.status}
                        onChange={ev => updateEmailStatus(idea.id, e.id, ev.target.value)}
                        className={`badge border cursor-pointer bg-transparent text-xs pr-4 ${STATUS_COLORS[e.status] || 'bg-slate-800 text-slate-400'}`}
                        style={{ appearance: 'auto' }}
                      >
                        {STATUS_OPTS.map(s => (
                          <option key={s} value={s} className="bg-slate-900 text-slate-200">{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{e.date}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => { setCompose({ subject: `Following up on ${idea.title}`, body: `Hi there,\n\nThank you for your interest in ${idea.title}...` }); setShowCompose(true); }}
                        className="btn-ghost py-1 text-xs"
                      >
                        <Send size={11} /> Message
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500 text-sm">No contacts match your filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Compose Modal */}
      <Modal isOpen={showCompose} onClose={() => setShowCompose(false)} title="Send Follow-up Email" maxWidth="max-w-xl">
        {sent ? (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">📨</p>
            <p className="text-emerald-400 font-semibold">Follow-up sent to {counts[filterStatus === 'all' ? 'all' : filterStatus]} contacts!</p>
            <p className="text-slate-500 text-sm mt-1">(Demo mode — no emails were actually sent)</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800 border border-slate-700">
              <Mail size={14} className="text-slate-400" />
              <span className="text-sm text-slate-400">
                Sending to{' '}
                <strong className="text-slate-200">
                  {filterStatus === 'all' ? 'all' : STATUS_LABELS[filterStatus]} ({counts[filterStatus === 'all' ? 'all' : filterStatus]} contacts)
                </strong>
              </span>
            </div>
            <div>
              <label className="label">Subject</label>
              <input value={compose.subject} onChange={e => setCompose(p => ({ ...p, subject: e.target.value }))} className="input" placeholder="Your email subject" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea rows={6} value={compose.body} onChange={e => setCompose(p => ({ ...p, body: e.target.value }))} className="textarea" placeholder="Write your follow-up message…" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCompose(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleSend} disabled={!compose.subject || !compose.body} className={`btn-primary flex-1 justify-center ${!compose.subject || !compose.body ? 'opacity-40 cursor-not-allowed' : ''}`}>
                <Send size={13} /> Send Email
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmailListTab;
