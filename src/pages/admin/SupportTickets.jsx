import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const ticketStatuses = ["Open", "In Progress", "Resolved", "Closed"];

const SupportTickets = () => {
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState("");
  const [replyText, setReplyText] = useState({});

  const load = async () => {
    try {
      const { data } = await api.get("/support/tickets/all");
      setTickets(data);
    } catch (_) {
      setError("Support tickets could not be loaded.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/support/tickets/${id}/status`, { status });
      setTickets((current) => current.map((ticket) => (ticket._id === id ? data : ticket)));
    } catch (_) {
      setError("Ticket status could not be updated.");
    }
  };

  const sendReply = async (id) => {
    const text = (replyText[id] || "").trim();
    if (!text) return;

    try {
      const { data } = await api.post(`/support/tickets/${id}/reply`, { message: text });
      setTickets((current) => current.map((ticket) => (ticket._id === id ? data : ticket)));
      setReplyText((current) => ({ ...current, [id]: "" }));
    } catch (_) {
      setError("Reply could not be sent.");
    }
  };

  const stats = useMemo(() => ({
    total: tickets?.length || 0,
    open: tickets?.filter((ticket) => ticket.status === "Open").length || 0,
    inProgress: tickets?.filter((ticket) => ticket.status === "In Progress").length || 0,
    resolved: tickets?.filter((ticket) => ticket.status === "Resolved").length || 0,
  }), [tickets]);

  if (!tickets) return <Loader label="Loading support tickets" />;

  return (
    <div>
      <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">CUSTOMER CARE</p>
      <h1 className="font-display text-3xl text-ink mb-1">Support tickets</h1>
      <p className="text-ink/50 mb-8">Monitor customer issues, update statuses, and reply to support requests.</p>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-ink/10 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-ink/50">Total</p>
          <p className="mt-2 font-display text-3xl">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-ink/50">Open</p>
          <p className="mt-2 font-display text-3xl">{stats.open}</p>
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-ink/50">In progress</p>
          <p className="mt-2 font-display text-3xl">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl border border-ink/10 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-ink/50">Resolved</p>
          <p className="mt-2 font-display text-3xl">{stats.resolved}</p>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-brick">{error}</p>}

      <div className="space-y-5">
        {tickets.map((ticket) => (
          <article key={ticket._id} className="rounded-xl border border-ink/10 bg-white p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-medium text-ink">{ticket.user?.name || "Customer"} <span className="text-ink/50">({ticket.user?.email || "No email"})</span></p>
                <p className="text-xs text-ink/50">Ticket #{String(ticket._id).slice(-6).toUpperCase()} · {new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={ticket.status}
                  onChange={(event) => updateStatus(ticket._id, event.target.value)}
                  className="rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm"
                >
                  {ticketStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm text-ink/70">
              <div>
                <p className="font-medium text-ink">Issue type</p>
                <p>{ticket.issueType}</p>
              </div>
              <div>
                <p className="font-medium text-ink">Order</p>
                <p>{ticket.order ? `#${String(ticket.order._id).slice(-6).toUpperCase()}` : "No linked order"}</p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-ink/10 bg-paper p-3 text-sm text-ink/70">
              <p className="font-medium text-ink">Customer message</p>
              <p className="mt-2 whitespace-pre-line">{ticket.message}</p>
            </div>

            {ticket.conversation?.length > 0 && (
              <div className="mt-4 rounded-lg border border-ink/10 bg-paper-dim p-3">
                <p className="font-medium text-ink">Conversation</p>
                <div className="mt-3 space-y-2">
                  {ticket.conversation.map((message, index) => (
                    <div key={`${ticket._id}-${index}`} className={`rounded-lg px-3 py-2 text-sm ${message.role === "admin" ? "bg-herb-dark text-paper" : "bg-white text-ink"}`}>
                      <span className="font-medium text-[10px] uppercase tracking-[0.2em] block mb-1">{message.role === "admin" ? "Support" : "Customer"}</span>
                      <p>{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <textarea
                rows="3"
                value={replyText[ticket._id] || ""}
                onChange={(event) => setReplyText((current) => ({ ...current, [ticket._id]: event.target.value }))}
                placeholder="Reply to customer..."
                className="flex-1 rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => sendReply(ticket._id)}
                className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper"
              >
                Send
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default SupportTickets;
