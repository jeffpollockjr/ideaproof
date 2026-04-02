import { useState } from 'react';
import { Eye, EyeOff, DollarSign, Calendar, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ValidationBadge from '../../components/ValidationBadge';

const MarketplacePreviewTab = ({ idea }) => {
  const { updateMarketplace } = useApp();
  const navigate = useNavigate();
  const { marketplace, validationScore } = idea;
  const [price, setPrice] = useState(marketplace.callPrice);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateMarketplace(idea.id, { callPrice: Number(price) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToggleListing = () => {
    updateMarketplace(idea.id, { isListed: !marketplace.isListed });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-xl text-white">Marketplace Listing</h3>
          <p className="text-slate-500 text-sm mt-1">
            {marketplace.isListed ? '🟢 Currently listed on marketplace' : '⚪ Not listed publicly'}
          </p>
        </div>
        <div className="flex gap-2">
          {marketplace.isListed && (
            <button
              onClick={() => navigate(`/marketplace/${idea.id}`)}
              className="btn-secondary"
            >
              <ExternalLink size={13} /> View Public Page
            </button>
          )}
          <button
            onClick={handleToggleListing}
            className={marketplace.isListed ? 'btn-danger' : 'btn-primary'}
          >
            {marketplace.isListed ? <><EyeOff size={13} /> Unlist Idea</> : <><Eye size={13} /> List on Marketplace</>}
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign size={15} className="text-amber-400" /> Call Booking Price
          </h4>
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              min="0"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="input pl-7 text-lg font-bold"
            />
          </div>
          <p className="text-xs text-slate-500 mb-4">Buyers pay this to book a 30-min call with you about this idea.</p>
          <button
            onClick={handleSave}
            className={`btn-primary w-full justify-center ${saved ? 'bg-emerald-500' : ''}`}
          >
            {saved ? <><Check size={13} /> Saved!</> : 'Save Price'}
          </button>
        </div>

        <div className="card">
          <h4 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar size={15} className="text-blue-400" /> Call Bookings
          </h4>
          {marketplace.callsBooked.length === 0 ? (
            <p className="text-slate-500 text-sm">No calls booked yet. List your idea to start receiving bookings.</p>
          ) : (
            <div className="space-y-3">
              {marketplace.callsBooked.map(call => (
                <div key={call.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xs font-bold text-slate-950 flex-shrink-0">
                    {call.buyerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{call.buyerName}</p>
                    <p className="text-xs text-slate-500 truncate">{call.company}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`badge border text-xs ${call.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-700/50 text-slate-400 border-slate-700'}`}>
                      {call.status}
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">{call.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Public page preview */}
      <div className="card">
        <h4 className="font-display font-semibold text-white mb-4">Public Page Preview</h4>
        <p className="text-xs text-slate-500 mb-4">This is how buyers will see your idea on the marketplace. Full details are gated behind the call booking.</p>

        <div className="rounded-xl border border-slate-700 overflow-hidden">
          {/* Mock public page */}
          <div className="bg-slate-950 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{idea.emoji}</span>
                <div>
                  <h2 className="font-display font-bold text-2xl text-white">{idea.title}</h2>
                  <span className="badge bg-slate-800 text-slate-400 border-slate-700 mt-1">{idea.category}</span>
                </div>
              </div>
              <ValidationBadge score={validationScore} size="lg" />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">The Problem</p>
                <p className="text-sm text-slate-300 leading-relaxed">{idea.pitch.problem || 'Problem statement will appear here.'}</p>
              </div>

              {/* Gated sections */}
              <div className="relative">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Solution</p>
                <div className="content-locked">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {idea.pitch.solution || 'Solution details are gated. Book a call to unlock.'}
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="badge bg-slate-800 text-slate-400 border border-slate-700 text-xs">
                    🔒 Unlocked after booking
                  </span>
                </div>
              </div>

              {/* Validation stats (public) */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-900 rounded-lg p-3 text-center">
                  <p className="font-display font-bold text-lg text-white">{idea.survey.responses.length}</p>
                  <p className="text-xs text-slate-500">Survey responses</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3 text-center">
                  <p className="font-display font-bold text-lg text-white">{idea.preOrder.responses.length}</p>
                  <p className="text-xs text-slate-500">Pre-order signals</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-3 text-center">
                  <p className="font-display font-bold text-lg text-white">{idea.emailList.length}</p>
                  <p className="text-xs text-slate-500">Email leads</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-800">
                <button className="btn-primary flex-1 justify-center py-3 text-base">
                  Book a Call — ${marketplace.callPrice}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePreviewTab;
