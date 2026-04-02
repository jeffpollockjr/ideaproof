import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Users, Mail, TrendingUp } from 'lucide-react';
import ValidationBadge, { StatusBadge } from './ValidationBadge';

const IdeaCard = ({ idea }) => {
  const navigate = useNavigate();
  const { survey, preOrder, emailList, landingPage } = idea;

  const stats = [
    { icon: MessageSquare, value: survey.responses.length, label: 'Responses' },
    { icon: TrendingUp, value: landingPage.metrics.clicks, label: 'LP Clicks' },
    { icon: Users, value: preOrder.responses.length, label: 'Pre-orders' },
    { icon: Mail, value: emailList.length, label: 'Emails' },
  ];

  return (
    <div
      onClick={() => navigate(`/ideas/${idea.id}`)}
      className="card cursor-pointer hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{idea.emoji}</span>
          <div>
            <h3 className="font-display font-bold text-white group-hover:text-amber-400 transition-colors text-lg leading-tight">
              {idea.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{idea.category}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <StatusBadge status={idea.status} />
          <ValidationBadge score={idea.validationScore} />
        </div>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">{idea.oneLiner}</p>

      <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-800">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Icon size={11} className="text-slate-500" />
            </div>
            <p className="text-base font-bold text-white font-display">{value}</p>
            <p className="text-xs text-slate-600">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-600">Created {idea.createdAt}</p>
        <span className="text-amber-500 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Open <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
};

export default IdeaCard;
