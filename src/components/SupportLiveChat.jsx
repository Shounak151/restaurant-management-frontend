import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import socket, { connectSocket } from "../socket";

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const sortMessages = (messageList) => [...messageList].sort((first, second) => {
  const firstTime = new Date(first.createdAt || 0).getTime();
  const secondTime = new Date(second.createdAt || 0).getTime();
  return firstTime - secondTime;
});

const SupportLiveChat = ({ conversationId, onResolved }) => {
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (!conversationId) return;
    let cancelled = false;

    const fetchConversation = async () => {
      try {
        const { data } = await api.get(`/live-support/conversations/${conversationId}/messages`);
        if (cancelled) return;
        setConversation(data.conversation);
        setMessages((current) => {
          const history = data.messages.map((message) => ({
            ...message,
            _id: message._id || `${message.createdAt}-${message.senderRole}`,
          }));
          const historyIds = new Set(history.map((message) => String(message._id)));
          return sortMessages([...history, ...current.filter((message) => !historyIds.has(String(message._id)))]);
        });
        await api.patch(`/live-support/conversations/${conversationId}/read`);
      } catch (_) {
        if (!cancelled) setMessages([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchConversation();

    return () => {
      cancelled = true;
    };
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    let active = true;
    hasConnectedRef.current = false;

    const joinConversation = () => socket.emit("support:join", conversationId);

    const reloadHistory = async () => {
      try {
        const { data } = await api.get(`/live-support/conversations/${conversationId}/messages`);
        if (!active) return;
        setConversation(data.conversation);
        setMessages((current) => {
          const history = data.messages.map((message) => ({
            ...message,
            _id: message._id || `${message.createdAt}-${message.senderRole}`,
          }));
          const historyIds = new Set(history.map((message) => String(message._id)));
          return sortMessages([...history, ...current.filter((message) => !historyIds.has(String(message._id)))]);
        });
      } catch (_) {
        // Keep the currently rendered messages if reconnect history is unavailable.
      }
    };

    const onConnect = () => {
      joinConversation();
      if (hasConnectedRef.current) reloadHistory();
      hasConnectedRef.current = true;
    };

    const onMessage = (payload) => {
      if (payload.conversationId !== conversationId) return;
      setMessages((current) => {
        const exists = current.some((message) => String(message._id) === String(payload.messageId));
        if (exists) return current;
        return sortMessages([...current, {
          _id: payload.messageId,
          conversation: conversationId,
          sender: { _id: payload.senderId, name: payload.senderName || "Support" },
          senderRole: payload.senderRole,
          message: payload.message,
          createdAt: payload.createdAt,
        }]);
      });
    };

    const onTyping = (payload) => {
      if (payload.conversationId !== conversationId) return;
      setTyping(Boolean(payload.isTyping) && payload.userId !== user?._id);
    };

    socket.on("connect", onConnect);
    socket.on("support:new-message", onMessage);
    socket.on("support:typing", onTyping);
    if (socket.connected) onConnect();
    else connectSocket();

    return () => {
      active = false;
      socket.emit("support:leave", conversationId);
      socket.off("connect", onConnect);
      socket.off("support:new-message", onMessage);
      socket.off("support:typing", onTyping);
    };
  }, [conversationId, user?._id]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typing]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !conversationId) return;

    setInput("");
    socket.emit("support:send-message", { conversationId, message: trimmed });
  };

  const resolve = async () => {
    if (!conversationId) return;
    try {
      await api.patch(`/live-support/conversations/${conversationId}/resolve`);
      setConversation((current) => ({ ...current, status: "Resolved" }));
      if (onResolved) onResolved();
    } catch (_) {
      // no-op
    }
  };

  if (!conversationId) return null;
  if (loading) return <div className="rounded-xl border border-ink/10 bg-white p-8 text-sm text-ink/60">Loading conversation…</div>;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-ink/10 bg-paper-dim px-4 py-3">
        <div>
          <p className="font-medium text-ink">{conversation?.customer?.name || "Customer"}</p>
          <p className="text-xs text-ink/55">{conversation?.status || "Open"}</p>
        </div>
        <button type="button" onClick={resolve} className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink">Resolve</button>
      </div>

      <div className="h-[420px] overflow-y-auto bg-[#fdfbf7] p-4">
        <div className="space-y-3">
          {messages.map((message) => {
            const isCustomer = message.senderRole === "customer";
            const isAdmin = message.senderRole === "admin";
            return (
              <div key={message._id} className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  isAdmin ? "bg-herb-dark text-paper" : "bg-ink text-paper"
                }`}>
                  <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">{isCustomer ? "Customer" : "Admin"}</p>
                  <p className="mt-1 whitespace-pre-line">{message.message}</p>
                  <p className="mt-2 text-[10px] opacity-80">{formatTime(message.createdAt)}</p>
                </div>
              </div>
            );
          })}
          {typing && <p className="text-xs text-ink/55">Support agent is typing...</p>}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-ink/10 bg-white p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") sendMessage();
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-ink/15 bg-paper px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim()}
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportLiveChat;
