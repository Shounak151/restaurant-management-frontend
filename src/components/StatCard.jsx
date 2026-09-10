import React from "react";

const StatCard = ({ label, value, hint }) => (
  <div className="bg-white border border-ink/10 rounded-lg p-6">
    <p className="text-sm text-ink/50">{label}</p>
    <p className="font-display text-4xl text-ink mt-2">{value}</p>
    {hint && <p className="text-xs text-ink/40 mt-2">{hint}</p>}
  </div>
);

export default StatCard;
