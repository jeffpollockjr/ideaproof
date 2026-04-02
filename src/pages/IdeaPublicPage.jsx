import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, Zap, TrendingUp, Users, Mail, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ValidationBadge from '../components/ValidationBadge';

const IdeaPublicPage = () => {
  const { id } = useParams();
  const { ideas } = useApp();
  const navigate = useNavigate();

  const idea = ideas.find(i => i.id === id);

  if (!idea) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Idea not found.</p>
          <button onClick={() => navigate('/marketplace')} className="btn-primary">Back to Marketplace</button>
        </div>
      </div>
    );
  }

  const ctr = idea.landingPage.metrics.visitors > 0
    ? ((idea.landingPage.metrics.clicks / idea.landingPage.metrics.visitors) * 100).toFixed(1)
    : null;

  const revSignal = idea.preOrder.responses.reduce((sum, r) => {
    const tier = idea.preOrder.tiers.find(t => t.id === r.tierId);
    return sum + (tier ? tier.price : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Nav */}
      <div className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/marketplace" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={14} />
            <div className="w-5 h-5 bg-amber-500 rounded flex items-center justify-center">
              <Zap size={10} className="text-slate-950" fill="currentColor" />
            </div>
            Marketplace
          </Link>
          <button
            onClick={() => navigate(`/marketplace/${id}/book`)}
            className="btn-primary"
          >
            Book a Call — ${idea.marketplace.callPrice}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Hero */}
        <div className="flex items-start gap-5 mb-8">
          <span className="text-6xl">{idea.emoji}</span>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display font-bold text-4xl text-white mb-2">{idea.title}</h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">{idea.oneLiner}</p>
              </div>
              <ValidationBadge score={idea.validationScore} size="lg" />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="badge bg-slate-800 text-slate-400 border-slate-700">{idea.category}</span>
              {ctr && <span className="badge bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{ctr}% landing page CTR</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem - PUBLIC */}
            <div className="card">
              <h3 className="font-display font-bold text-white text-lg mb-3 flex items-center gap-2">
                🔴 The Problem
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm">{idea.pitch.problem || 'Problem statement not provided.'}</p>
            </div>

            {/* Target Customer - PUBLIC */}
            <div className="card">
              <h3 className="font-display font-bold text-white text-lg mb-3">👤 Target Customer</h3>
              <p className="text-slate-300 leading-relaxed text-sm">{idea.pitch.targetCustomer || 'Target customer details not provided.'}</p>
            </div>

            {/* Solution - GATED */}
            <div className="card relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-xl border border-amber-500/20">
                <Lock size={20} className="text-amber-400 mb-2" />
                <p className="font-display font-bold text-white">Unlock Full Solution Details</p>
                <p className="text-slate-400 text-sm mt-1 mb-4">Book a call to get access to the complete solution, business model, and financials.</p>
                <button onClick={() => navigate(`/marketplace/${id}/book`)} className="btn-primary">
                  Book a Call — ${idea.marketplace.callPrice}
                </button>
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-3">🟢 The Solution</h3>
              <p className="text-slate-300 leading-relaxed text-sm content-locked">
                {idea.pitch.solution || 'This is the full solution description which is gated behind the call booking.'}
              </p>
            </div>

            {/* Business Model - GATED */}
            <div className="card relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <Lock size={16} className="text-amber-400 mx-auto mb-1" />
                  <p className="text-slate-400 text-sm">Business model gated</p>
                </div>
              </div>
              <h3 className="font-display font-bold text-white text-lg mb-3">💰 Business Model</h3>
              <p className="text-slate-300 leading-relaxed text-sm content-locked">
                {idea.pitch.businessModel || 'Business model details are locked.'}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* CTA card */}
            <div className="card border-amber-500/20 bg-amber-500/5">
              <h4 className="font-display font-bold text-white mb-1">Interested?</h4>
              <p className="text-slate-400 text-xs mb-4">Book a 30-minute discovery call to get the full pitch, validation data, and answer your questions.</p>
              <button
                onClick={() => navigate(`/marketplace/${id}/book`)}
                className="btn-primary w-full justify-center py-3 text-base"
              >
                Book a Call
              </button>
              <p className="text-center text-amber-400 font-bold text-lg mt-3">${idea.marketplace.callPrice}</p>
              <p className="text-center text-xs text-slate-500 mt-0.5">One-time fee</p>

              {idea.marketplace.callsBooked.length > 0 && (
                <p className="text-center text-xs text-slate-500 mt-3 pt-3 border-t border-slate-800">
                  {idea.marketplace.callsBooked.length} call{idea.marketplace.callsBooked.length > 1 ? 's' : ''} already booked
                </p>
              )}
            </div>

            {/* Validation signals */}
            <div className="card">
              <h4 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-amber-400" /> Validation Data
              </h4>
              <div className="space-y-3">
                {[
                  { icon: MessageSquare, label: 'Survey Responses', value: idea.survey.responses.length, color: 'text-blue-400' },
                  { icon: Users, label: 'Pre-Order Signals', value: idea.preOrder.responses.length, color: 'text-purple-400' },
                  { icon: Mail, label: 'Email Leads', value: idea.emailList.length, color: 'text-emerald-400' },
                  ...(ctr ? [{ icon: TrendingUp, label: 'Landing Page CTR', value: `${ctr}%`, color: 'text-amber-400' }] : []),
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon size={13} className={color} />
                      <span className="text-xs text-slate-400">{label}</span>
                    </div>
                    <span className={`font-display font-bold text-sm ${color}`}>{value}</span>
                  </div>
                ))}
                {revSignal > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-xs text-slate-400">Revenue signal</span>
                    <span className="font-display font-bold text-sm text-emerald-400">${revSignal.toLocaleString()}/mo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller info */}
            <div className="card">
              <h4 className="font-display font-bold text-white mb-3">The Seller</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950">
                  JR
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Jordan Rivera</p>
                  <p className="text-xs text-slate-500">3 ideas listed · Fast responder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaPublicPage;
