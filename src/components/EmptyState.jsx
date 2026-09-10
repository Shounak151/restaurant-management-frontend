import React from "react";

const EmptyState = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-20 px-6 border border-dashed border-ink/20 rounded-lg">
    <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mb-4">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A87F2C" strokeWidth="1.8">
        <path d="M4 6h16M4 12h10M4 18h7" strokeLinecap="round" />
      </svg>
    </div>
    <p className="font-display text-xl text-ink mb-1">{title}</p>
    <p className="text-sm text-ink/60 max-w-sm mb-6">{description}</p>
    {action}
  </div>
);

export default EmptyState;
