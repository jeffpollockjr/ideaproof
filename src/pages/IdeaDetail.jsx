import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import OverviewTab from './tabs/OverviewTab';
import SurveyTab from './tabs/SurveyTab';
import LandingPageTab from './tabs/LandingPageTab';
import PreOrderTab from './tabs/PreOrderTab';
import EmailListTab from './tabs/EmailListTab';
import MarketplacePreviewTab from './tabs/MarketplacePreviewTab';

const TABS = [
  { id: 'overview', label: '📋 Overview' },
  { id: 'survey', label: '📊 Survey' },
  { id: 'landing', label: '🖥️ Landing Page' },
  { id: 'preorder', label: '💸 Pre-Order' },
  { id: 'emails', label: '📧 Email List' },
  { id: 'marketplace', label: '🏪 Marketplace' },
];

const IdeaDetail = () => {
  const { id } = useParams();
  const { ideas } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const idea = ideas.find(i => i.id === id);

  if (!idea) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-400">Idea not found.</p>
        <button onClick={() => navigate('/ideas')} className="btn-primary mt-4">Back to Ideas</button>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab idea={idea} />;
      case 'survey': return <SurveyTab idea={idea} />;
      case 'landing': return <LandingPageTab idea={idea} />;
      case 'preorder': return <PreOrderTab idea={idea} />;
      case 'emails': return <EmailListTab idea={idea} />;
      case 'marketplace': return <MarketplacePreviewTab idea={idea} />;
      default: return null;
    }
  };

  // Tab-level stat badges
  const tabBadges = {
    survey: idea.survey.responses.length > 0 ? idea.survey.responses.length : null,
    preorder: idea.preOrder.responses.length > 0 ? idea.preOrder.responses.length : null,
    emails: idea.emailList.length > 0 ? idea.emailList.length : null,
    marketplace: idea.marketplace.callsBooked.length > 0 ? idea.marketplace.callsBooked.length : null,
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex items-center gap-3 py-4">
            <button onClick={() => navigate('/ideas')} className="btn-ghost -ml-1">
              <ArrowLeft size={15} />
            </button>
            <span className="text-2xl">{idea.emoji}</span>
            <h1 className="font-display font-bold text-xl text-white">{idea.title}</h1>
            <span className="text-slate-600 text-sm hidden sm:inline">/ {idea.category}</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 overflow-x-auto scrollbar-none -mb-px">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-amber-400'
                    : 'text-slate-400 hover:text-slate-200 border-transparent'
                }`}
              >
                {tab.label}
                {tabBadges[tab.id] && (
                  <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                    activeTab === tab.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {tabBadges[tab.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-8 py-8 page-enter">
        {renderTab()}
      </div>
    </div>
  );
};

export default IdeaDetail;
