import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ChatMessage from "./ChatMessage";
import ChatQuickActions from "./ChatQuickActions";
import SupportLiveChat from "./SupportLiveChat";
import { chatbotFaq } from "../data/chatbotFaq";
import api from "../api/axios";

const TRACK_ACTION = "📦 Track My Order";
const MY_ORDERS_ACTION = "🧾 My Orders";
const CANCEL_ACTION = "❌ Cancel Order";
const PAYMENT_ACTION = "💳 Payment & Refund";
const REPORT_ACTION = "🚨 Report a Problem";
const FAQ_ACTION = "❓ FAQs";
const HUMAN_ACTION = "👨‍💼 Talk to Human";
const LOGIN_ACTION = "Login";

const orderStatusSequence = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const statusToDot = (status) => {
  const currentIndex = orderStatusSequence.indexOf(status);
  const items = orderStatusSequence.map((item, index) => ({
    label: item,
    active: index <= currentIndex,
    current: item === status,
  }));

  return items;
};

const formatMoney = (value) => `₹${Number(value || 0).toFixed(0)}`;

const ChatWindow = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! Welcome to TastyBites Support.\n\nHow can I help you today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingSupportIssue, setPendingSupportIssue] = useState(null);
  const [liveConversationId, setLiveConversationId] = useState(null);
  const [quickActions, setQuickActions] = useState([
    TRACK_ACTION,
    MY_ORDERS_ACTION,
    CANCEL_ACTION,
    PAYMENT_ACTION,
    REPORT_ACTION,
    FAQ_ACTION,
    HUMAN_ACTION,
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const addMessage = (text, isUser = false) => {
    setMessages((current) => [...current, { id: Date.now() + Math.random(), text, isUser }]);
  };

  const handleLoginRedirect = () => {
    window.location.href = "/login";
  };

  const handleGuestFallback = () => {
    addMessage("Please login to access your orders and customer support.", false);
    setQuickActions([LOGIN_ACTION, FAQ_ACTION]);
  };

  const renderOrderCard = (order) => {
    const steps = statusToDot(order.orderStatus || "Pending");

    return (
      <div className="mt-3 rounded-xl border border-ink/10 bg-white p-3 text-left text-ink">
        <p className="font-medium">Order #{String(order._id).slice(-6).toUpperCase()}</p>
        <p className="mt-1 text-xs text-ink/60">{order.items?.map((item) => `${item.name} × ${item.quantity}`).join(" • ") || "Order items"}</p>
        <p className="mt-2 text-sm font-medium">Total: {formatMoney(order.totalAmount)}</p>
        <p className="mt-2 text-xs text-ink/70">Status:</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {steps.map((step) => (
            <div key={step.label} className="flex items-center gap-1 text-[10px]">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${step.active ? "bg-gold" : "bg-ink/15"}`} />
              <span className={step.current ? "font-medium text-ink" : "text-ink/50"}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const buildFaqBlock = () =>
    chatbotFaq
      .slice(0, 5)
      .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
      .join("\n\n");

  const getSupportTicketOptions = [
    "Missing Item",
    "Wrong Item",
    "Food Arrived Cold",
    "Order Is Late",
    "Payment Problem",
    "Other Problem",
  ];

  const getPaymentOptions = [
    "Payment Failed",
    "Payment Deducted But Order Not Created",
    "Payment Pending",
    "Refund Status",
    "Other Payment Issue",
  ];

  const handleAction = async (action) => {
    if (!action) return;
    setError("");
    setLoading(true);

    try {
      if (action === LOGIN_ACTION) {
        handleLoginRedirect();
        return;
      }

      if (action === FAQ_ACTION) {
        addMessage(action, true);
        addMessage(buildFaqBlock(), false);
        setQuickActions([TRACK_ACTION, MY_ORDERS_ACTION, CANCEL_ACTION, PAYMENT_ACTION, REPORT_ACTION, HUMAN_ACTION]);
        return;
      }

      if (!user) {
        addMessage(action, true);
        handleGuestFallback();
        return;
      }

      addMessage(action, true);

      if (action === TRACK_ACTION) {
        const { data } = await api.get("/orders/mine");
        const activeOrders = (data || []).filter((order) => !["Delivered", "Cancelled"].includes(order.orderStatus));

        if (!activeOrders.length) {
          addMessage("No active orders found.", false);
          addMessage("You can also view all your orders from the My Orders section.", false);
          setQuickActions([MY_ORDERS_ACTION, CANCEL_ACTION, REPORT_ACTION, HUMAN_ACTION]);
          return;
        }

        addMessage("Here are your active orders:", false);
        activeOrders.slice(0, 3).forEach((order) => addMessage(renderOrderCard(order), false));
        setQuickActions([MY_ORDERS_ACTION, CANCEL_ACTION, REPORT_ACTION, HUMAN_ACTION]);
        return;
      }

      if (action === MY_ORDERS_ACTION) {
        const { data } = await api.get("/orders/mine");
        if (!data?.length) {
          addMessage("No orders found for your account yet.", false);
          return;
        }

        const summary = data
          .slice(0, 3)
          .map((order) => `Order #${String(order._id).slice(-6).toUpperCase()} | ${order.items?.map((item) => `${item.name} × ${item.quantity}`).join(", ") || "Items"} | Total: ${formatMoney(order.totalAmount)} | Status: ${order.orderStatus}`)
          .join("\n");

        addMessage(summary, false);
        addMessage("If you want, select an order and I can help you check details or cancel it if eligible.", false);
        setQuickActions([TRACK_ACTION, CANCEL_ACTION, REPORT_ACTION, HUMAN_ACTION]);
        return;
      }

      if (action === CANCEL_ACTION) {
        const { data } = await api.get("/orders/mine");
        const cancellable = (data || []).filter((order) => ["Pending", "Confirmed", "Preparing"].includes(order.orderStatus));

        if (!cancellable.length) {
          addMessage("There are no eligible orders to cancel right now.", false);
          return;
        }

        addMessage(
          cancellable
            .map((order) => `Order #${String(order._id).slice(-6).toUpperCase()} | ${order.orderStatus} | ${formatMoney(order.totalAmount)}`)
            .join("\n"),
          false
        );
        addMessage("Reply with the order number you want to cancel, or tell me which order should be cancelled.", false);
        return;
      }

      if (action === PAYMENT_ACTION) {
        addMessage("Choose the payment issue you are facing:", false);
        setQuickActions(getPaymentOptions);
        return;
      }

      if (getPaymentOptions.includes(action)) {
        addMessage(`Payment issue: ${action}`, false);
        addMessage("I’ve noted this. If the payment is still pending or has not been confirmed, please allow a moment while I verify the latest payment/order status.", false);
        try {
          const { data } = await api.get("/orders/mine");
          if (data?.length) {
            const latest = data[0];
            addMessage(`Latest order: #${String(latest._id).slice(-6).toUpperCase()} | Payment: ${latest.paymentStatus} | Status: ${latest.orderStatus}`, false);
          }
        } catch (_) {
          addMessage("Payment status is currently unavailable. Please contact support for a manual review.", false);
        }
        setQuickActions([REPORT_ACTION, HUMAN_ACTION, FAQ_ACTION]);
        return;
      }

      if (action === REPORT_ACTION) {
        addMessage("Please choose the issue type:", false);
        setPendingSupportIssue(null);
        setQuickActions(getSupportTicketOptions);
        return;
      }

      if (getSupportTicketOptions.includes(action)) {
        setPendingSupportIssue(action);
        addMessage(`Issue: ${action}`, false);
        addMessage("Please describe the problem in a short message and I’ll create a support ticket for you.", false);
        setQuickActions(["Send support request"]);
        return;
      }

      if (action === HUMAN_ACTION) {
        try {
          const { data } = await api.post("/live-support/conversations", {});
          setLiveConversationId(data._id);
          addMessage("You're connected with TastyBites Support.", false);
          setQuickActions([TRACK_ACTION, MY_ORDERS_ACTION, CANCEL_ACTION, PAYMENT_ACTION, REPORT_ACTION, FAQ_ACTION]);
        } catch (_) {
          addMessage("Support is currently unavailable. You can leave a message and our team will get back to you.", false);
        }
        return;
      }

      if (action === "Send support request" || action === "Create support request") {
        addMessage("Please enter your message and I'll submit the support request.", false);
        return;
      }

      addMessage("I’m here to help. Please choose one of the quick actions or type your question.", false);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
      addMessage("Something went wrong while checking your account information. Please try again or contact support.", false);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setError("");
    addMessage(trimmed, true);
    setInput("");
    setLoading(true);

    if (pendingSupportIssue) {
      try {
        const { data } = await api.post("/support/tickets", {
          issueType: pendingSupportIssue,
          message: trimmed,
        });
        addMessage(`Your support request has been created. Ticket #${String(data._id).slice(-6).toUpperCase()} is ${data.status}. Our support team will review it shortly.`, false);
        setPendingSupportIssue(null);
        setQuickActions([TRACK_ACTION, MY_ORDERS_ACTION, CANCEL_ACTION, PAYMENT_ACTION, REPORT_ACTION, FAQ_ACTION, HUMAN_ACTION]);
        setLoading(false);
        return;
      } catch (err) {
        const message = err?.response?.data?.message || "Support ticket could not be created.";
        addMessage(message, false);
        setPendingSupportIssue(null);
        setLoading(false);
        return;
      }
    }

    const lower = trimmed.toLowerCase();

    try {
      if (!user) {
        if (lower.includes("order") || lower.includes("cancel") || lower.includes("payment") || lower.includes("support") || lower.includes("missing") || lower.includes("late")) {
          handleGuestFallback();
          return;
        }
        addMessage("I can help with general questions. Please choose a quick action or login to access order support.", false);
        return;
      }

      if (lower.includes("track") || lower.includes("where is my order") || lower.includes("order status") || lower.includes("late")) {
        await handleAction(TRACK_ACTION);
        return;
      }

      if (lower.includes("cancel") && lower.includes("order")) {
        await handleAction(CANCEL_ACTION);
        return;
      }

      if (lower.includes("refund") || lower.includes("payment failed") || lower.includes("money was deducted") || lower.includes("payment pending")) {
        await handleAction(PAYMENT_ACTION);
        return;
      }

      if (lower.includes("missing") || lower.includes("wrong item") || lower.includes("cold") || lower.includes("late") || lower.includes("problem")) {
        await handleAction(REPORT_ACTION);
        return;
      }

      if (lower.includes("support") || lower.includes("human")) {
        await handleAction(HUMAN_ACTION);
        return;
      }

      if (lower.includes("my orders") || lower.includes("previous orders")) {
        await handleAction(MY_ORDERS_ACTION);
        return;
      }

      const { data } = await api.get("/support/faq");
      const match = (data?.items || []).find((item) => item.question.toLowerCase().includes(lower) || lower.includes(item.question.toLowerCase()));

      if (match) {
        addMessage(`${match.question}\n${match.answer}`, false);
      } else {
        addMessage("I can help with order tracking, payment issues, cancellations, and support tickets. Please choose a quick action to continue.", false);
      }
    } catch (err) {
      const message = err?.response?.data?.message || "I couldn’t process that request right now.";
      addMessage(message, false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[92vw] max-w-md rounded-3xl border border-ink/10 bg-paper shadow-2xl">
      <div className="flex items-center justify-between border-b border-ink/10 bg-herb-dark px-4 py-3 text-paper">
        <div>
          <p className="font-display text-xl">TastyBites Support</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-paper/60">Customer care</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-full border border-paper/20 p-2 text-sm text-paper">✕</button>
      </div>

      {liveConversationId ? (
        <SupportLiveChat conversationId={liveConversationId} onResolved={() => setLiveConversationId(null)} />
      ) : (
        <div className="flex max-h-[70vh] min-h-[420px] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#fcfaf5] p-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message.text} isUser={message.isUser} />
            ))}
            {loading && <ChatMessage message="Thinking…" isUser={false} />}
            {error && <p className="text-xs text-brick">{error}</p>}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-ink/10 bg-white p-3">
            <ChatQuickActions actions={quickActions} onAction={handleAction} disabled={loading} />
            <div className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSend();
                }}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink/35"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
