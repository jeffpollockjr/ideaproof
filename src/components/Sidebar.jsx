import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Lightbulb, Store, Bell, Settings, LogOut, Plus, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/ideas', icon: Lightbulb, label: 'My Ideas' },
  { to: '/marketplace', icon: Store, label: 'Marketplace' },
];

const Sidebar = () => {
  const { user, logout, unreadCount } = useApp();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-slate-950 border-r border-slate-800 flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-slate-950" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">IdeaProof</span>
        </div>
      </div>

      {/* New Idea Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => navigate('/ideas/new')}
          className="btn-primary w-full justify-center py-2.5"
        >
          <Plus size={15} />
          New Idea
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-2 py-2 mt-2">Menu</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        {/* Notifications with badge */}
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`
          }
        >
          <Bell size={16} />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-auto bg-amber-500 text-slate-950 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`
          }
        >
          <Settings size={16} />
          Settings
        </NavLink>
      </nav>

      {/* User Profile */}
      {user && (
        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-slate-950">{user.avatar}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
