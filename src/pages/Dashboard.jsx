import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Mail, TrendingUp, Lightbulb, ArrowRight, Plus, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ValidationBadge';

const StatCard = ({ icon: Icon, label, value, sub, color = 'amber' }) => {
  const colors = {
    amber: 'text-amber-400 bg-amber-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
  };
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon size={16} className={colors[color].split(' ')[0]} />
        </div>
      </div>
      <p className="font-display font-bold text-3xl text-white mb-1">{value}</p>
      <p className="text-sm font-medium text-slate-300">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
};

const Dashboard = () => {
  const { user, ideas, notifications } = useApp();
  const navigate = useNavigate();

  const totalSurveyResponses = ideas.reduce((s, i) => s + i.survey.responses.length, 0);
  const totalPreOrders = ideas.reduce((s, i) => s + i.preOrder.responses.length, 0);
  const totalEmails = ideas.reduce((s, i) => s + i.emailList.length, 0);
  const totalClicks = ideas.reduce((s, i) => s + i.landingPage.metrics.clicks, 0);
  const listedIdeas = ideas.filter(i => i.status === 'listed');
  const totalCallsBooked = ideas.reduce((s, i) => s + i.marketplace.callsBooked.length, 0);

  const upcomingCalls = ideas
    .flatMap(i => i.marketplace.callsBooked.map(c => ({ ...c, ideaTitle: i.title, ideaId: i.id })))
    .filter(c => c.status === 'upcoming')
    .slice(0, 3);

  const recentNotifs = notifications.slice(0, 5);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="text-amber-400">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your ideas.</p>
        </div>
        <button onClick={() => navigate('/ideas/new')} className="btn-primary">
          <Plus size={15} /> New Idea
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Lightbulb} label="Total Ideas" value={ideas.length} sub={`${listedIdeas.length} listed on marketplace`} color="amber" />
        <StatCard icon={MessageSquare} label="Survey Responses" value={totalSurveyResponses} sub="Across all ideas" color="blue" />
        <StatCard icon={Users} label="Pre-Order Signals" value={totalPreOrders} sub={`${totalClicks} landing page clicks`} color="emerald" />
        <StatCard icon={Mail} label="Email Leads" value={totalEmails} sub={`${totalCallsBooked} calls booked`} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Ideas */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-white">Your Ideas</h2>
            <button onClick={() => navigate('/ideas')} className="btn-ghost text-xs">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {ideas.slice(0, 4).map(idea => (
              <div
                key={idea.id}
                onClick={() => navigate(`/ideas/${idea.id}`)}
                className="card-sm cursor-pointer hover:border-slate-700 transition-all group flex items-center gap-4"
              >
                <span className="text-2xl">{idea.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-white group-hover:text-amber-400 transition-colors">{idea.title}</h3>
                    <StatusBadge status={idea.status} />
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{idea.oneLiner}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">{idea.validationScore}</p>
                  <p className="text-xs text-slate-600">score</p>
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-amber-400 transition-colors" />
              </div>
            ))}
            {ideas.length === 0 && (
              <div className="card text-center py-10">
                <p className="text-slate-500 mb-4">No ideas yet.</p>
                <button onClick={() => navigate('/ideas/new')} className="btn-primary">
                  <Plus size={14} /> Create your first idea
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Upcoming Calls */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-white">Upcoming Calls</h2>
              <Calendar size={15} className="text-slate-500" />
            </div>
            {upcomingCalls.length > 0 ? (
              <div className="space-y-3">
                {upcomingCalls.map(call => (
                  <div key={call.id} className="card-sm">
                    <p className="text-sm font-semibold text-white">{call.buyerName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{call.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20">{call.date}</span>
                      <span className="text-xs text-slate-500">{call.time}</span>
                    </div>
                    <p className="text-xs text-amber-400 mt-1.5">Re: {call.ideaTitle}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-sm text-center py-6">
                <p className="text-slate-500 text-sm">No upcoming calls</p>
                <p className="text-slate-600 text-xs mt-1">List an idea to start booking</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="font-display font-bold text-lg text-white mb-4">Recent Activity</h2>
            <div className="space-y-2">
              {recentNotifs.map(n => (
                <div key={n.id} className={`flex items-start gap-3 p-3 rounded-lg ${!n.read ? 'bg-slate-800/60' : 'bg-transparent'}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-amber-400' : 'bg-slate-700'}`} />
                  <div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{n.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
