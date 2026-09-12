import React, { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";
import socket, { connectSocket } from "../socket";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("tastybites_token");
    if (!token) return;

    connectSocket();
    const onMessage = () => {
      if (!isOpen) {
        setUnreadCount((count) => count + 1);
      }
    };

    socket.on("support:new-message", onMessage);
    return () => socket.off("support:new-message", onMessage);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((state) => {
      const nextState = !state;
      if (nextState) setUnreadCount(0);
      return nextState;
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Open customer support chatbot"
        className="fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-3xl text-ink shadow-xl transition hover:scale-105"
      >
        💬
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-brick px-1 text-[10px] font-bold text-paper">
            {unreadCount}
          </span>
        )}
      </button>

      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Chatbot;
