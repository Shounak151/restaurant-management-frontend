import React from "react";

const ChatMessage = ({ message, isUser = false }) => (
  <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
        isUser
          ? "bg-ink text-paper"
          : "border border-ink/10 bg-paper-dim text-ink"
      }`}
    >
      {message}
    </div>
  </div>
);

export default ChatMessage;
