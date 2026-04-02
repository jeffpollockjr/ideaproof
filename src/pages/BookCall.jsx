import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, Clock, Zap, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

const getNextDays = () => {
  const days = [];
  const d = new Date();
  for (let i = 1; i <= 10; i++) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      days.push(new Date(d));
    }
    if (days.length >= 6) break;
  }
  return days;
};

const fmt = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

const BookCall = () => {
  const { id } = useParams();
  const { ideas, bookCall } = useApp();
  const navigate = useNavigate();

  const idea = ideas.find(i => i.id === id);
  const days = getNextDays();

  const [step, setStep] = useState(1); // 1: select time, 2: details, 3: payment, 4: confirmed
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });
  const [payment, setPayment] = useState({ card: '', expiry: '', cvv: '', name: '' });
  const [processing, setProcessing] = useState(false);

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

  const handleBook = () => {
    setProcessing(true);
    setTimeout(() => {
      bookCall(idea.id, {
        buyerName: form.name,
        company: form.company || 'Independent',
        date: fmt(selectedDay),
        time: selectedTime,
      });
      setProcessing(false);
      setStep(4);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Nav */}
      <div className="border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to={`/marketplace/${id}`} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} />
            Back to idea
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center">
              <Zap size={11} className="text-slate-950" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-white text-sm">IdeaProof</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-12">
        {step === 4 ? (
          // Confirmation
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-emerald-400" strokeWidth={3} />
            </div>
            <h1 className="font-display font-bold text-3xl text-white mb-3">You're Booked! 🎉</h1>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Your call about <strong className="text-white">{idea.title}</strong> is confirmed for{' '}
              <strong className="text-white">{fmt(selectedDay)} at {selectedTime}</strong>.
            </p>
            <div className="card max-w-sm mx-auto text-left mb-8">
              <div className="space-y-3">
                {[
                  { label: 'Idea', value: idea.title },
                  { label: 'Date', value: `${fmt(selectedDay)} · ${selectedTime}` },
                  { label: 'Duration', value: '30 minutes' },
                  { label: 'Format', value: 'Video call (link sent to email)' },
                  { label: 'Amount paid', value: `$${idea.marketplace.callPrice}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs text-slate-200 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/marketplace')} className="btn-secondary">Browse More Ideas</button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl">{idea.emoji}</span>
              <div>
                <h1 className="font-display font-bold text-2xl text-white">Book a Call — {idea.title}</h1>
                <p className="text-slate-400 text-sm mt-0.5">30-minute discovery call · ${idea.marketplace.callPrice}</p>
              </div>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s < step ? 'bg-amber-500 text-slate-950' : s === step ? 'bg-amber-500/20 border-2 border-amber-500 text-amber-400' : 'bg-slate-800 text-slate-600'}`}>
                    {s < step ? <Check size={12} strokeWidth={3} /> : s}
                  </div>
                  <span className={`text-xs ${s === step ? 'text-amber-400' : 'text-slate-600'}`}>
                    {['Select Time', 'Your Details', 'Payment'][s - 1]}
                  </span>
                  {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-amber-500' : 'bg-slate-800'}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Pick time */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar size={15} className="text-amber-400" /> Select a Date
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {days.map(day => (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDay(day)}
                        className={`p-3 rounded-xl border text-center transition-all ${selectedDay?.toDateString() === day.toDateString() ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 hover:border-slate-600'}`}
                      >
                        <p className="text-xs text-slate-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <p className="font-display font-bold text-white text-sm mt-0.5">{day.getDate()}</p>
                        <p className="text-xs text-slate-500">{day.toLocaleDateString('en-US', { month: 'short' })}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDay && (
                  <div className="card">
                    <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                      <Clock size={15} className="text-amber-400" /> Select a Time ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`p-2.5 rounded-lg border text-sm font-medium transition-all ${selectedTime === t ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedDay || !selectedTime}
                    className={`btn-primary ${!selectedDay || !selectedTime ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="card">
                  <h3 className="font-display font-semibold text-white mb-4">Your Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Full Name *</label>
                        <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input" placeholder="Jane Smith" required />
                      </div>
                      <div>
                        <label className="label">Company / Fund</label>
                        <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} className="input" placeholder="Acme Ventures" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input" placeholder="jane@fund.com" required />
                    </div>
                    <div>
                      <label className="label">What would you like to discuss? (optional)</label>
                      <textarea rows={2} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="textarea" placeholder="Specific questions, your background, areas of interest…" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
                  <button onClick={() => setStep(3)} disabled={!form.name || !form.email} className={`btn-primary ${!form.name || !form.email ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="card">
                  <h3 className="font-display font-semibold text-white mb-1 flex items-center gap-2">
                    <CreditCard size={15} className="text-amber-400" /> Payment
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">Demo mode — no real payment will be processed.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="label">Card Number</label>
                      <input value={payment.card} onChange={e => setPayment(p => ({ ...p, card: e.target.value }))} className="input" placeholder="4242 4242 4242 4242" maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">Expiry</label>
                        <input value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value }))} className="input" placeholder="MM / YY" maxLength={7} />
                      </div>
                      <div>
                        <label className="label">CVV</label>
                        <input value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value }))} className="input" placeholder="123" maxLength={4} />
                      </div>
                    </div>
                    <div>
                      <label className="label">Name on Card</label>
                      <input value={payment.name} onChange={e => setPayment(p => ({ ...p, name: e.target.value }))} className="input" placeholder="Jane Smith" />
                    </div>
                  </div>
                </div>

                {/* Order summary */}
                <div className="card bg-slate-800/50">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Discovery call · {idea.title}</span>
                      <span className="text-white font-medium">${idea.marketplace.callPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">{fmt(selectedDay)} · {selectedTime}</span>
                      <span className="text-slate-500">30 min</span>
                    </div>
                    <div className="border-t border-slate-700 pt-2 flex justify-between">
                      <span className="font-semibold text-white">Total</span>
                      <span className="font-display font-bold text-amber-400 text-lg">${idea.marketplace.callPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
                  <button
                    onClick={handleBook}
                    disabled={processing}
                    className={`btn-primary min-w-36 justify-center ${processing ? 'opacity-70' : ''}`}
                  >
                    {processing ? 'Processing…' : `Pay $${idea.marketplace.callPrice}`}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookCall;
