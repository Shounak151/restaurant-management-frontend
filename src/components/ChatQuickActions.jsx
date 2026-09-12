import React from "react";

const ChatQuickActions = ({ actions, onAction, disabled = false }) => (
  <div className="flex flex-wrap gap-2 pt-2">
    {actions.map((action) => (
      <button
        key={action}
        type="button"
        onClick={() => onAction(action)}
        disabled={disabled}
        className="rounded-full border border-ink/15 bg-white px-3 py-2 text-xs font-medium text-ink transition hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {action}
      </button>
    ))}
  </div>
);

export default ChatQuickActions;
