import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const statuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const Orders = () => {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const load = () => api.get("/orders").then(({ data }) => setOrders(data)).catch(() => setError("Orders could not be loaded."));
  useEffect(load, []);
  const updateStatus = async (id, orderStatus) => { try { const { data } = await api.patch(`/orders/${id}/status`, { orderStatus }); setOrders((current) => current.map((order) => order._id === id ? data : order)); } catch (_) { setError("Status could not be updated."); } };
  if (!orders) return <Loader label="Loading orders" />;
  return <div><p className="text-gold-dark text-sm tracking-[0.15em] mb-2">KITCHEN QUEUE</p><h1 className="font-display text-3xl text-ink mb-1">Orders</h1><p className="text-ink/50 mb-8">Review payments and move each order through the kitchen.</p>{error && <p className="text-sm text-brick mb-4">{error}</p>}<div className="space-y-4">{orders.map((order) => <article key={order._id} className="bg-white border border-ink/10 rounded-lg p-5"><div className="flex flex-wrap justify-between gap-4"><div><p className="font-mono text-xs text-ink/60">#{order._id}</p><p className="font-medium mt-2">{order.user?.name} <span className="font-normal text-ink/50">{order.user?.email}</span></p><p className="text-xs text-ink/45 mt-1">{new Date(order.createdAt).toLocaleString()}</p></div><div className="text-right"><p className="font-display text-2xl">₹{order.totalAmount.toFixed(0)}</p><p className="text-xs text-ink/55">Payment: {order.paymentStatus}</p></div></div><div className="border-t border-ink/10 mt-4 pt-4 flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-ink/70">{order.items.map((item) => <span key={item._id} className="mr-4">{item.name} x {item.quantity}</span>)}</p><select value={order.orderStatus} onChange={(event) => updateStatus(order._id, event.target.value)} className="px-3 py-2 rounded-md border border-ink/15 bg-white text-sm">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><p className="text-xs text-ink/45 mt-3">Deliver to: {order.deliveryAddress}</p></article>)}</div></div>;
};

export default Orders;
