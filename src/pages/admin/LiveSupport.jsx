import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import SupportLiveChat from "../../components/SupportLiveChat";

const LiveSupport = () => {
  const [conversations, setConversations] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");

  const loadConversations = async () => {
    try {
      const { data } = await api.get("/live-support/conversations/all");
      setConversations(data);
      if (!selectedId && data.length) {
        setSelectedId(data[0]._id);
      }
    } catch (_) {
      setError("Customer support conversations could not be loaded.");
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const selectedConversation = useMemo(
    () => conversations?.find((conversation) => conversation._id === selectedId) || null,
    [conversations, selectedId]
  );

  if (!conversations) return <Loader label="Loading support chats" />;

  return (
    <div>
      <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">LIVE SUPPORT</p>
      <h1 className="font-display text-3xl text-ink mb-1">Customer support</h1>
      <p className="text-ink/50 mb-8">Reply to customer conversations in real time.</p>

      {error && <p className="mb-4 text-sm text-brick">{error}</p>}

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-3">
          {conversations.length === 0 ? (
            <div className="rounded-xl border border-ink/10 bg-white p-4 text-sm text-ink/60">
              No open support conversations.
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation._id}
                type="button"
                onClick={() => setSelectedId(conversation._id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedId === conversation._id ? "border-gold bg-paper" : "border-ink/10 bg-white"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-ink">{conversation.customer?.name || "Customer"}</p>
                  {conversation.unreadForAdmin > 0 && <span className="rounded-full bg-brick px-2 py-0.5 text-[10px] font-medium text-paper">{conversation.unreadForAdmin}</span>}
                </div>
                <p className="mt-2 text-xs text-ink/55">{conversation.status}</p>
                <p className="mt-2 text-sm text-ink/70 line-clamp-2">{conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleString() : "Recently"}</p>
              </button>
            ))
          )}
        </aside>

        <div className="min-w-0">
          {selectedConversation ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-ink/10 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-ink/50">Customer</p>
                <p className="font-medium text-ink">{selectedConversation.customer?.name}</p>
                <p className="text-sm text-ink/60">{selectedConversation.customer?.email}</p>
                {selectedConversation.order && (
                  <div className="mt-3 rounded-xl bg-paper-dim p-3 text-sm text-ink/70">
                    <p>Order: #{String(selectedConversation.order._id).slice(-6).toUpperCase()}</p>
                    <p>Status: {selectedConversation.order.orderStatus}</p>
                    <p>Total: ₹{Number(selectedConversation.order.totalAmount || 0).toFixed(0)}</p>
                  </div>
                )}
              </div>
              <SupportLiveChat conversationId={selectedConversation._id} onResolved={loadConversations} />
            </div>
          ) : (
            <div className="rounded-xl border border-ink/10 bg-white p-8 text-sm text-ink/60">Select a customer conversation to begin.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSupport;
