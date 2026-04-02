import { useNavigate } from 'react-router-dom';
import { Bell, Check, MessageSquare, Users, Calendar, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NOTIF_ICONS = {
  survey_response: { icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10' },
  preorder: { icon: Users, color: 'text-purple-400 bg-purple-500/10' },
  call_booked: { icon: Calendar, color: 'text-emerald-400 bg-emerald-500/10' },
  landing_page: { icon: TrendingUp, color: 'text-amber-400 bg-amber-500/10' },
};

const Notifications = () => {
  const { notifications, markNotificationRead, markAllRead } = useApp();
  const navigate = useNavigate();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Notifications</h1>
          <p className="text-slate-400 mt-1">{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-ghost flex items-center gap-2 text-sm">
            <Check size={13} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center py-16">
          <Bell size={40} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notif => {
            const { icon: Icon, color } = NOTIF_ICONS[notif.type] || { icon: Bell, color: 'text-slate-400 bg-slate-800' };
            return (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.ideaId) navigate(`/ideas/${notif.ideaId}`);
                }}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                  !notif.read
                    ? 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                    : 'border-transparent hover:bg-slate-800/30'
                }`}
              >
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${color}`}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">{notif.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {notif.ideaTitle && (
                      <span className="text-xs text-amber-500">{notif.ideaTitle}</span>
                    )}
                    <span className="text-xs text-slate-600">{notif.date}</span>
                  </div>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
