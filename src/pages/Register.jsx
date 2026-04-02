import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seller' });

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Zap size={15} className="text-slate-950" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-lg text-white">IdeaProof</span>
        </div>

        <h2 className="font-display font-bold text-3xl text-white mb-2">Create your account</h2>
        <p className="text-slate-400 mb-8">Start validating and selling your ideas today.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input value={form.name} onChange={set('name')} className="input" placeholder="Jordan Rivera" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" value={form.email} onChange={set('email')} className="input" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" value={form.password} onChange={set('password')} className="input" placeholder="••••••••" required />
          </div>
          <div>
            <label className="label">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              {[{ value: 'seller', label: '💡 Selling Ideas', desc: 'I create & validate ideas' }, { value: 'buyer', label: '🔍 Buying Ideas', desc: 'I\'m an entrepreneur or investor' }].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, role: opt.value }))}
                  className={`p-3 rounded-xl border text-left transition-all ${form.role === opt.value ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}
                >
                  <p className="text-sm font-semibold text-white">{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary w-full justify-center py-3 mt-2">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-400 hover:text-amber-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
