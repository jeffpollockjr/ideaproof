import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ValidationBadge from '../components/ValidationBadge';

const CATEGORIES = ['All', 'SaaS', 'Consumer Tech', 'Marketplace', 'HealthTech', 'FinTech', 'LegalTech', 'EdTech', 'Other'];

const Marketplace = () => {
  const { ideas, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('score');

  const listed = ideas.filter(i => i.status === 'listed' || i.status === 'sold');

  const filtered = listed
    .filter(i => {
      const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.oneLiner.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || i.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.validationScore - a.validationScore;
      if (sortBy === 'price_asc') return a.marketplace.callPrice - b.marketplace.callPrice;
      if (sortBy === 'price_desc') return b.marketplace.callPrice - a.marketplace.callPrice;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
              <Zap size={13} className="text-slate-950" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-white">IdeaProof</span>
          </Link>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="btn-secondary text-sm">My Dashboard</button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn-ghost text-sm">Sign In</button>
                <button onClick={() => navigate('/register')} className="btn-primary text-sm">Get Started</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-5xl text-white mb-4">
            Buy Validated <span className="text-amber-400">Business Ideas</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every idea listed here has been tested with real market data — surveys, pre-order signals, and landing page tests. Browse and book a call to learn more.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9"
              placeholder="Search ideas…"
            />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="select sm:w-48">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="select sm:w-48">
            <option value="score">Highest Validation</option>
            <option value="price_asc">Lowest Price</option>
            <option value="price_desc">Highest Price</option>
          </select>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-2 mb-6">
          <Filter size={13} className="text-slate-500" />
          <p className="text-sm text-slate-500">{filtered.length} idea{filtered.length !== 1 ? 's' : ''} listed</p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(idea => (
              <div
                key={idea.id}
                onClick={() => navigate(`/marketplace/${idea.id}`)}
                className="card cursor-pointer hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200 group flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{idea.emoji}</span>
                    <div>
                      <h3 className="font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                        {idea.title}
                      </h3>
                      <span className="badge bg-slate-800 text-slate-400 border-0 text-xs mt-0.5">{idea.category}</span>
                    </div>
                  </div>
                  <ValidationBadge score={idea.validationScore} />
                </div>

                <p className="text-sm text-slate-400 leading-relaxed flex-1 mb-4">{idea.oneLiner}</p>

                {/* Validation signals */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-800 mb-4">
                  <div className="text-center">
                    <p className="font-display font-bold text-white">{idea.survey.responses.length}</p>
                    <p className="text-xs text-slate-600">Surveys</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-white">{idea.preOrder.responses.length}</p>
                    <p className="text-xs text-slate-600">Pre-orders</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-white">
                      {idea.landingPage.metrics.visitors > 0
                        ? `${((idea.landingPage.metrics.clicks / idea.landingPage.metrics.visitors) * 100).toFixed(0)}%`
                        : '—'}
                    </p>
                    <p className="text-xs text-slate-600">LP CTR</p>
                  </div>
                </div>

                <button className="btn-primary w-full justify-center">
                  Book a Call — ${idea.marketplace.callPrice}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="font-display font-bold text-xl text-white mb-2">No ideas found</h3>
            <p className="text-slate-500">
              {search || category !== 'All' ? 'Try adjusting your filters.' : 'No ideas are listed yet.'}
            </p>
            {isAuthenticated && (
              <button onClick={() => navigate('/ideas/new')} className="btn-primary mt-6">
                List Your Idea
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
