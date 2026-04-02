import { useState } from 'react';
import { Check, User, Bell, CreditCard, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Section = ({ icon: Icon, title, children }) => (
  <div className="card">
    <div className="flex items-center gap-2.5 mb-5">
      <div className="p-2 bg-amber-500/10 rounded-lg">
        <Icon size={15} className="text-amber-400" />
      </div>
      <h3 className="font-display font-bold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const Settings = () => {
  const { user, logout } = useApp();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [notifications, setNotifications] = useState({ survey: true, preorder: true, calls: true, landing: false });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotif = (key) => setNotifications(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="font-display font-bold text-3xl text-white mb-2">Settings</h1>
      <p className="text-slate-400 mb-8">Manage your account preferences.</p>

      <div className="space-y-6">
        {/* Profile */}
        <Section icon={User} title="Profile">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-display font-bold text-2xl text-slate-950">
              {user?.avatar}
            </div>
            <div>
              <p className="font-semibold text-white">{user?.name}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <p className="text-xs text-slate-600 mt-1">Member since {user?.joinedAt}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="input" />
            </div>
            <button onClick={handleSave} className={`btn-primary ${saved ? 'bg-emerald-500' : ''}`}>
              {saved ? <><Check size={13} /> Saved!</> : 'Save Changes'}
            </button>
          </div>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notification Preferences">
          <div className="space-y-3">
            {[
              { key: 'survey', label: 'New survey response', desc: 'When someone responds to one of your surveys' },
              { key: 'preorder', label: 'New pre-order signal', desc: 'When someone submits a pricing preference' },
              { key: 'calls', label: 'Call bookings', desc: 'When a buyer books a call with you' },
              { key: 'landing', label: 'Landing page milestones', desc: 'Traffic and CTR milestone alerts' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-800/50">
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => toggleNotif(key)}
                  className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${notifications[key] ? 'bg-amber-500' : 'bg-slate-600'}`}
                  style={{ height: '22px', minWidth: '40px' }}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[key] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* Payout */}
        <Section icon={CreditCard} title="Payout Method">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-dashed border-slate-700 text-center">
            <CreditCard size={24} className="text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">No payout method connected</p>
            <p className="text-xs text-slate-600 mt-1 mb-3">Add a bank account or PayPal to receive call booking payments.</p>
            <button className="btn-secondary text-xs">Connect Payout Method</button>
            <p className="text-xs text-slate-600 mt-2">(Demo — not functional)</p>
          </div>
        </Section>

        {/* Account */}
        <Section icon={Shield} title="Account">
          <div className="space-y-3">
            <button className="btn-secondary w-full justify-start">Change Password</button>
            <button onClick={logout} className="btn-danger w-full justify-start">Sign Out</button>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Settings;
