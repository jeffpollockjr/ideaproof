import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const { login, loginAsDemo } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    navigate('/dashboard');
  };

  const handleDemo = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-950 border-r border-slate-800 flex-col justify-between p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-slate-950" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-xl text-white">IdeaProof</span>
        </div>

        <div>
          <h1 className="font-display font-bold text-5xl text-white leading-tight mb-6">
            Turn ideas into<br />
            <span className="text-amber-400">validated assets.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Survey real people, test your landing page, collect pre-order signals, and sell your idea to entrepreneurs and VCs — all in one platform.
          </p>
          <div className="space-y-3">
            {['Validate with real market data', 'Build an email list of interested buyers', 'List your idea on the marketplace', 'Sell calls to interested investors'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-sm">© 2025 IdeaProof. Demo application.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Zap size={15} className="text-slate-950" fill="currentColor" />
              </div>
              <span className="font-display font-bold text-lg text-white">IdeaProof</span>
            </div>
            <h2 className="font-display font-bold text-3xl text-white mb-2">Welcome back</h2>
            <p className="text-slate-400">Sign in to your account to continue.</p>
          </div>

          {/* Demo banner */}
          <button
            onClick={handleDemo}
            className="w-full mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-all group flex items-center justify-between"
          >
            <div className="text-left">
              <p className="text-amber-400 font-semibold text-sm">Continue as Demo User</p>
              <p className="text-slate-500 text-xs mt-0.5">Pre-loaded with sample ideas & validation data</p>
            </div>
            <ArrowRight size={16} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-950 px-3 text-xs text-slate-600">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3">
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
