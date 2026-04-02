import { useState } from 'react';
import { Plus, Trash2, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

const PreOrderTab = ({ idea }) => {
  const { updatePreOrderTiers, addPreOrderResponse } = useApp();
  const [showTierModal, setShowTierModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [newTier, setNewTier] = useState({ name: '', price: '', description: '' });
  const [signupForm, setSignupForm] = useState({ email: '', tierId: '' });
  const [successMsg, setSuccessMsg] = useState(false);

  const { tiers, responses } = idea.preOrder;

  const getTierCount = (tierId) => responses.filter(r => r.tierId === tierId).length;

  const barData = tiers.map((t, i) => ({
    name: t.name,
    responses: getTierCount(t.id),
    fill: COLORS[i % COLORS.length],
  }));

  const pieData = tiers
    .map((t, i) => ({ name: t.name, value: getTierCount(t.id), fill: COLORS[i % COLORS.length] }))
    .filter(d => d.value > 0);

  const totalRevSignal = responses.reduce((sum, r) => {
    const tier = tiers.find(t => t.id === r.tierId);
    return sum + (tier ? tier.price : 0);
  }, 0);

  const handleAddTier = () => {
    if (!newTier.name || !newTier.price) return;
    const updated = [...tiers, { id: `t_${Date.now()}`, name: newTier.name, price: parseFloat(newTier.price), description: newTier.description }];
    updatePreOrderTiers(idea.id, updated);
    setNewTier({ name: '', price: '', description: '' });
    setShowTierModal(false);
  };

  const handleDeleteTier = (id) => {
    updatePreOrderTiers(idea.id, tiers.filter(t => t.id !== id));
  };

  const handleSignup = () => {
    if (!signupForm.email || !signupForm.tierId) return;
    addPreOrderResponse(idea.id, signupForm);
    setSignupForm({ email: '', tierId: '' });
    setSuccessMsg(true);
    setTimeout(() => { setSuccessMsg(false); setShowSignupModal(false); }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-xl text-white">Pre-Order / Pricing Test</h3>
          <p className="text-slate-500 text-sm mt-1">{responses.length} signals collected</p>
        </div>
        <div className="flex gap-2">
          {tiers.length > 0 && (
            <button onClick={() => setShowSignupModal(true)} className="btn-secondary">
              <Users size={13} /> Simulate Sign-up
            </button>
          )}
          <button onClick={() => setShowTierModal(true)} className="btn-primary">
            <Plus size={14} /> Add Tier
          </button>
        </div>
      </div>

      {/* Summary cards */}
      {responses.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card">
            <Users size={14} className="text-blue-400 mb-2" />
            <p className="font-display font-bold text-2xl text-white">{responses.length}</p>
            <p className="text-xs text-slate-500 mt-1">Total signals</p>
          </div>
          <div className="stat-card">
            <DollarSign size={14} className="text-emerald-400 mb-2" />
            <p className="font-display font-bold text-2xl text-white">${totalRevSignal.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Revenue signal</p>
          </div>
          <div className="stat-card">
            <TrendingUp size={14} className="text-amber-400 mb-2" />
            <p className="font-display font-bold text-2xl text-white">
              ${responses.length > 0 ? (totalRevSignal / responses.length).toFixed(0) : 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">Avg. willingness to pay</p>
          </div>
        </div>
      )}

      {tiers.length === 0 ? (
        <div className="card text-center py-12 border-dashed border-slate-700">
          <DollarSign size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No pricing tiers yet</p>
          <p className="text-slate-600 text-sm mt-1 mb-4">Create 1–3 tiers to test what price people are willing to pay.</p>
          <button onClick={() => setShowTierModal(true)} className="btn-primary">
            <Plus size={14} /> Add First Tier
          </button>
        </div>
      ) : (
        <>
          {/* Tier cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tiers.map((tier, i) => {
              const count = getTierCount(tier.id);
              const pct = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0;
              return (
                <div key={tier.id} className="card relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-1 w-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-display font-bold text-lg text-white">{tier.name}</span>
                    <button onClick={() => handleDeleteTier(tier.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="font-display font-bold text-3xl mb-2" style={{ color: COLORS[i % COLORS.length] }}>
                    ${typeof tier.price === 'number' && tier.price % 1 !== 0 ? tier.price.toFixed(2) : tier.price}
                    <span className="text-xs text-slate-500 font-body font-normal">/mo</span>
                  </p>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">{tier.description}</p>
                  <div className="pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500">{count} signals</span>
                      <span className="font-medium" style={{ color: COLORS[i % COLORS.length] }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          {responses.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h4 className="font-display font-semibold text-white mb-4">Tier Distribution</h4>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                      <Bar dataKey="responses" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <h4 className="font-display font-semibold text-white mb-4">Share by Tier</h4>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value">
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                      <Legend iconSize={8} iconType="circle" formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 11 }}>{v}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Tier Modal */}
      <Modal isOpen={showTierModal} onClose={() => setShowTierModal(false)} title="Add Pricing Tier">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Tier Name</label>
              <input value={newTier.name} onChange={e => setNewTier(p => ({ ...p, name: e.target.value }))} className="input" placeholder="e.g. Pro, Basic, Enterprise" />
            </div>
            <div>
              <label className="label">Price (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input type="number" value={newTier.price} onChange={e => setNewTier(p => ({ ...p, price: e.target.value }))} className="input pl-7" placeholder="29.99" />
              </div>
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={2} value={newTier.description} onChange={e => setNewTier(p => ({ ...p, description: e.target.value }))} className="textarea" placeholder="What's included in this tier?" />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowTierModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleAddTier} disabled={!newTier.name || !newTier.price} className={`btn-primary flex-1 justify-center ${!newTier.name || !newTier.price ? 'opacity-40 cursor-not-allowed' : ''}`}>
              Add Tier
            </button>
          </div>
        </div>
      </Modal>

      {/* Simulate Sign-up Modal */}
      <Modal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} title="Simulate Pre-Order Signal">
        {successMsg ? (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-emerald-400 font-semibold">Signal recorded!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" value={signupForm.email} onChange={e => setSignupForm(p => ({ ...p, email: e.target.value }))} className="input" placeholder="user@example.com" />
            </div>
            <div>
              <label className="label">Which tier would you choose?</label>
              <div className="space-y-2">
                {tiers.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSignupForm(p => ({ ...p, tierId: t.id }))}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${signupForm.tierId === t.id ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
                  >
                    <span className="font-medium">{t.name}</span>
                    <span className="font-bold">${typeof t.price === 'number' && t.price % 1 !== 0 ? t.price.toFixed(2) : t.price}/mo</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSignupModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleSignup} disabled={!signupForm.email || !signupForm.tierId} className={`btn-primary flex-1 justify-center ${!signupForm.email || !signupForm.tierId ? 'opacity-40 cursor-not-allowed' : ''}`}>
                Submit Signal
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PreOrderTab;
