import { useState } from 'react';
import { TrendingUp, Play, Eye, MousePointer, Users, Percent } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

const LandingPageTab = ({ idea }) => {
  const { updateLandingPage, simulateTraffic } = useApp();
  const [isSimulating, setIsSimulating] = useState(false);
  const { landingPage } = idea;
  const { headline, subheadline, cta, isRunning, metrics } = landingPage;

  const ctr = metrics.visitors > 0 ? ((metrics.clicks / metrics.visitors) * 100).toFixed(1) : '0.0';
  const vtr = metrics.impressions > 0 ? ((metrics.visitors / metrics.impressions) * 100).toFixed(1) : '0.0';

  const handleSimulate = () => {
    setIsSimulating(true);
    simulateTraffic(idea.id);
    setTimeout(() => setIsSimulating(false), 1000);
  };

  // Build sparkline data from metrics
  const sparkData = metrics.impressions > 0
    ? Array.from({ length: 7 }, (_, i) => ({
        day: `Day ${i + 1}`,
        impressions: Math.round((metrics.impressions / 7) * (0.6 + Math.random() * 0.8)),
        visitors: Math.round((metrics.visitors / 7) * (0.6 + Math.random() * 0.8)),
        clicks: Math.round((metrics.clicks / 7) * (0.6 + Math.random() * 0.8)),
      }))
    : [];

  const statCards = [
    { icon: Eye, label: 'Impressions', value: metrics.impressions.toLocaleString(), color: 'text-blue-400' },
    { icon: Users, label: 'Visitors', value: metrics.visitors.toLocaleString(), color: 'text-purple-400' },
    { icon: MousePointer, label: 'CTA Clicks', value: metrics.clicks.toLocaleString(), color: 'text-emerald-400' },
    { icon: Percent, label: 'Click-Through Rate', value: `${ctr}%`, color: 'text-amber-400', highlight: parseFloat(ctr) > 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-xl text-white">Landing Page Test</h3>
          <p className="text-slate-500 text-sm mt-1">
            {isRunning ? '🟢 Test is active' : '⚪ Test not started'}
          </p>
        </div>
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className={`btn-primary ${isSimulating ? 'opacity-70' : ''}`}
        >
          <Play size={13} className={isSimulating ? 'animate-pulse' : ''} />
          {isSimulating ? 'Simulating…' : 'Run Traffic Simulation'}
        </button>
      </div>

      {/* LP Editor */}
      <div className="card">
        <h4 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-lg">🖥️</span> Landing Page Content
        </h4>
        <div className="space-y-4">
          <div>
            <label className="label">Headline</label>
            <input
              value={headline}
              onChange={e => updateLandingPage(idea.id, { headline: e.target.value })}
              className="input text-base"
              placeholder="Your bold, attention-grabbing headline"
            />
          </div>
          <div>
            <label className="label">Sub-headline</label>
            <textarea
              rows={2}
              value={subheadline}
              onChange={e => updateLandingPage(idea.id, { subheadline: e.target.value })}
              className="textarea"
              placeholder="A supporting sentence that explains the value proposition"
            />
          </div>
          <div>
            <label className="label">CTA Button Text</label>
            <input
              value={cta}
              onChange={e => updateLandingPage(idea.id, { cta: e.target.value })}
              className="input"
              placeholder="Get Early Access"
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      {(headline || subheadline) && (
        <div className="rounded-xl overflow-hidden border border-slate-700">
          <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-xs text-slate-500 flex-1 text-center">Landing Page Preview</span>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-10 text-center">
            <h2 className="font-display font-bold text-2xl text-white mb-3 leading-tight">
              {headline || 'Your Headline Here'}
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              {subheadline || 'Your supporting message goes here.'}
            </p>
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-all">
              {cta || 'Get Early Access'}
            </button>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, highlight }) => (
          <div key={label} className={`stat-card ${highlight ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
            <Icon size={15} className={`${color} mb-3`} />
            <p className={`font-display font-bold text-2xl ${highlight ? 'text-amber-400' : 'text-white'}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Visitor/Clicks over time chart */}
      {sparkData.length > 0 && (
        <div className="card">
          <h4 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-amber-400" /> Traffic Over Time
          </h4>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="visitors" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Visitors" />
                <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} dot={false} name="Clicks" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-purple-500" /><span className="text-xs text-slate-500">Visitors</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-emerald-500" /><span className="text-xs text-slate-500">Clicks</span></div>
          </div>
        </div>
      )}

      {metrics.impressions === 0 && (
        <div className="card text-center py-10 border-dashed border-slate-700">
          <TrendingUp size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No traffic data yet</p>
          <p className="text-slate-600 text-sm mt-1 mb-4">Fill in your landing page content and click "Run Traffic Simulation" to generate demo metrics.</p>
        </div>
      )}
    </div>
  );
};

export default LandingPageTab;
