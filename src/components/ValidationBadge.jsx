const ValidationBadge = ({ score, size = 'sm' }) => {
  const getColor = (s) => {
    if (s >= 80) return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Strong' };
    if (s >= 55) return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Good' };
    if (s >= 25) return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Early' };
    return { bg: 'bg-slate-700/40', text: 'text-slate-400', border: 'border-slate-600/30', label: 'None' };
  };

  const { bg, text, border, label } = getColor(score);

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${bg} ${border}`}>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-4 rounded-full ${i < Math.round(score / 20) ? text.replace('text-', 'bg-') : 'bg-slate-700'}`}
            />
          ))}
        </div>
        <span className={`text-sm font-semibold ${text}`}>{score}</span>
        <span className={`text-xs ${text} opacity-75`}>{label}</span>
      </div>
    );
  }

  return (
    <span className={`badge border ${bg} ${border} ${text}`}>
      {score > 0 ? `${score} · ${label}` : 'No data'}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    draft: { bg: 'bg-slate-700/50', text: 'text-slate-400', border: 'border-slate-600/50', label: 'Draft' },
    validating: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Validating' },
    listed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Listed' },
    sold: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', label: 'Sold' },
  };
  const { bg, text, border, label } = map[status] || map.draft;
  return (
    <span className={`badge border ${bg} ${border} ${text}`}>
      {label}
    </span>
  );
};

export default ValidationBadge;
