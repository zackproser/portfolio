import React from 'react';

const Callout = ({ type = 'info', title, showLabel = false, className = '', children }) => {
  const base = 'rounded-xl border p-4 md:p-5'
  const theme = {
    info: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-white/10',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    error: 'bg-rose-50 text-rose-900 border-rose-200',
    // keep any legacy variants used elsewhere
    announcement: 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 text-white border-white/10',
    epilogue: 'bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 text-white border-white/10',
    SpecialCallout: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-white/10',
  }

  return (
    <div className={`${base} ${theme[type] || ''} ${className}`}>
      {title && <div className="font-semibold mb-1">{title}</div>}
      {showLabel && <div className="uppercase text-xs opacity-70 mb-1">{type}:</div>}
      <div className="leading-relaxed">{children}</div>
    </div>
  )
};

export default Callout;
