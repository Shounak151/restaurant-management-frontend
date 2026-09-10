import React from "react";

const Loader = ({ label = "Loading" }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-3 text-ink/50">
    <div className="w-8 h-8 border-2 border-ink/15 border-t-gold rounded-full animate-spin" />
    <p className="text-sm">{label}…</p>
  </div>
);

export default Loader;
