import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['SaaS', 'Consumer Tech', 'Marketplace', 'HealthTech', 'FinTech', 'LegalTech', 'EdTech', 'CleanTech', 'E-commerce', 'Media', 'Other'];
const EMOJIS = ['💡', '🚀', '🔥', '⚡', '🌱', '🎯', '🏆', '🔮', '💎', '🌍', '🛠️', '🤖', '🎪', '🌊', '🦋', '🐾', '💼', '⚖️', '🏥', '🎓'];

const STEPS = ['Core Info', 'The Pitch', 'Validation Setup', 'Marketplace'];

const CreateIdea = () => {
  const { addIdea } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: '', oneLiner: '', category: 'SaaS', emoji: '💡',
    pitch: { problem: '', solution: '', targetCustomer: '', businessModel: '' },
    validationConfig: { survey: true, landingPage: true, preOrder: true, emailCapture: true },
    marketplace: { callPrice: 199 },
  });

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const setPitch = (k) => (e) => setForm(p => ({ ...p, pitch: { ...p.pitch, [k]: e.target.value } }));
  const toggleValidation = (k) => setForm(p => ({ ...p, validationConfig: { ...p.validationConfig, [k]: !p.validationConfig[k] } }));

  const canNext = () => {
    if (step === 0) return form.title.trim() && form.oneLiner.trim();
    if (step === 1) return form.pitch.problem.trim() && form.pitch.solution.trim();
    return true;
  };

  const handleSubmit = () => {
    const id = addIdea(form);
    navigate(`/ideas/${id}`);
  };

  const stepContent = [
    // Step 0: Core Info
    <div key="s0" className="space-y-5">
      <div>
        <label className="label">Idea Title *</label>
        <input value={form.title} onChange={set('title')} className="input" placeholder="e.g. PetPulse, DeskMesh, LegalDraft AI" />
      </div>
      <div>
        <label className="label">One-Liner Description *</label>
        <input value={form.oneLiner} onChange={set('oneLiner')} className="input" placeholder="Describe your idea in one compelling sentence" />
        <p className="text-xs text-slate-500 mt-1">{form.oneLiner.length}/120</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select value={form.category} onChange={set('category')} className="select">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Emoji / Icon</label>
          <div className="flex flex-wrap gap-1.5 mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 max-h-28 overflow-y-auto">
            {EMOJIS.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => setForm(p => ({ ...p, emoji: e }))}
                className={`text-xl p-1 rounded transition-all ${form.emoji === e ? 'bg-amber-500/20 ring-2 ring-amber-500' : 'hover:bg-slate-700'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,

    // Step 1: The Pitch
    <div key="s1" className="space-y-5">
      <div>
        <label className="label">The Problem *</label>
        <textarea rows={3} value={form.pitch.problem} onChange={setPitch('problem')} className="textarea" placeholder="What pain point does this solve? Be specific about who suffers and how badly." />
      </div>
      <div>
        <label className="label">The Solution *</label>
        <textarea rows={3} value={form.pitch.solution} onChange={setPitch('solution')} className="textarea" placeholder="How does your idea solve it? What makes it different?" />
      </div>
      <div>
        <label className="label">Target Customer</label>
        <textarea rows={2} value={form.pitch.targetCustomer} onChange={setPitch('targetCustomer')} className="textarea" placeholder="Who is the primary buyer? Be specific about demographics, behaviors, and needs." />
      </div>
      <div>
        <label className="label">Business Model</label>
        <textarea rows={2} value={form.pitch.businessModel} onChange={setPitch('businessModel')} className="textarea" placeholder="How does it make money? Subscription, marketplace, licensing, freemium…" />
      </div>
    </div>,

    // Step 2: Validation Setup
    <div key="s2" className="space-y-4">
      <p className="text-sm text-slate-400">Choose which validation tools to activate for this idea. You can configure each one after creation.</p>
      {[
        { key: 'survey', emoji: '📋', title: 'Survey', desc: 'Build a custom survey to collect structured feedback from potential customers.' },
        { key: 'landingPage', emoji: '🖥️', title: 'Landing Page Test', desc: 'Create a landing page and simulate traffic to measure interest and CTR.' },
        { key: 'preOrder', emoji: '💸', title: 'Pre-Order / Pricing Test', desc: 'Set up pricing tiers and collect signals from people willing to pay.' },
        { key: 'emailCapture', emoji: '📧', title: 'Email List', desc: 'Capture emails from interested users across all your validation tools.' },
      ].map(({ key, emoji, title, desc }) => (
        <button
          key={key}
          type="button"
          onClick={() => toggleValidation(key)}
          className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
            form.validationConfig[key]
              ? 'border-amber-500/40 bg-amber-500/5'
              : 'border-slate-700 bg-slate-800/30 opacity-60'
          }`}
        >
          <span className="text-2xl flex-shrink-0">{emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${form.validationConfig[key] ? 'border-amber-500 bg-amber-500' : 'border-slate-600'}`}>
            {form.validationConfig[key] && <Check size={11} className="text-slate-950" strokeWidth={3} />}
          </div>
        </button>
      ))}
    </div>,

    // Step 3: Marketplace
    <div key="s3" className="space-y-5">
      <p className="text-sm text-slate-400">Set up how your idea will appear on the marketplace. You can update this at any time.</p>
      <div>
        <label className="label">Call Booking Price (USD)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
          <input
            type="number"
            min="0"
            value={form.marketplace.callPrice}
            onChange={e => setForm(p => ({ ...p, marketplace: { ...p.marketplace, callPrice: Number(e.target.value) } }))}
            className="input pl-7"
            placeholder="199"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">Buyers pay this to book a 30-min discovery call with you. Set to 0 for free calls.</p>
      </div>
      <div className="card bg-slate-800/50 border-slate-700">
        <p className="text-sm font-semibold text-white mb-2">💡 Pricing Tips</p>
        <ul className="text-xs text-slate-400 space-y-1.5">
          <li>• <strong className="text-slate-300">$99–$199</strong> — Good for early-stage ideas with light validation</li>
          <li>• <strong className="text-slate-300">$299–$499</strong> — Well-validated ideas with strong data & market research</li>
          <li>• <strong className="text-slate-300">$499+</strong> — Fully packaged concepts with financials & go-to-market plans</li>
        </ul>
      </div>
    </div>,
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button onClick={() => navigate('/ideas')} className="btn-ghost mb-6 -ml-1">
        <ArrowLeft size={15} /> Back to Ideas
      </button>

      <h1 className="font-display font-bold text-3xl text-white mb-2">Create New Idea</h1>
      <p className="text-slate-400 mb-8">Walk through the setup to build your idea profile.</p>

      {/* Step indicators */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-amber-500 text-slate-950' : i === step ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400' : 'bg-slate-800 border-2 border-slate-700 text-slate-600'
              }`}>
                {i < step ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>
              <span className={`text-xs mt-1 font-medium whitespace-nowrap ${i === step ? 'text-amber-400' : i < step ? 'text-slate-400' : 'text-slate-600'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 ${i < step ? 'bg-amber-500' : 'bg-slate-800'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card min-h-64">
        {stepContent[step]}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/ideas')}
          className="btn-secondary"
        >
          <ArrowLeft size={14} /> {step === 0 ? 'Cancel' : 'Back'}
        </button>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className={`btn-primary ${!canNext() ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            Continue <ArrowRight size={14} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary">
            <Check size={14} /> Create Idea
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateIdea;
