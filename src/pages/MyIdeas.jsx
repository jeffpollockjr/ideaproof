import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import IdeaCard from '../components/IdeaCard';

const STATUSES = ['all', 'draft', 'validating', 'listed', 'sold'];

const MyIdeas = () => {
  const { ideas } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ideas.filter(i => {
    const matchStatus = filter === 'all' || i.status === filter;
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.oneLiner.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">My Ideas</h1>
          <p className="text-slate-400 mt-1">{ideas.length} idea{ideas.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={() => navigate('/ideas/new')} className="btn-primary">
          <Plus size={15} /> New Idea
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Search ideas…"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                filter === s ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(idea => <IdeaCard key={idea.id} idea={idea} />)}
        </div>
      ) : (
        <div className="card text-center py-16">
          <p className="text-4xl mb-4">💡</p>
          <h3 className="font-display font-bold text-xl text-white mb-2">
            {search || filter !== 'all' ? 'No ideas match your filters' : 'No ideas yet'}
          </h3>
          <p className="text-slate-500 mb-6">
            {search || filter !== 'all' ? 'Try a different search or filter.' : 'Create your first idea and start validating it with real data.'}
          </p>
          {!search && filter === 'all' && (
            <button onClick={() => navigate('/ideas/new')} className="btn-primary">
              <Plus size={14} /> Create Idea
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyIdeas;
