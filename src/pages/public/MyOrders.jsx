import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const MyOrders = () => {
  const [orders, setOrders] = useState(null);
  useEffect(() => { api.get("/orders/mine").then(({ data }) => setOrders(data)).catch(() => setOrders([])); }, []);
  if (!orders) return <Loader label="Finding your orders" />;
  return <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14"><p className="text-gold-dark text-sm tracking-[0.15em] mb-2">YOUR HISTORY</p><h1 className="font-display text-4xl text-ink mb-8">My orders</h1>{orders.length === 0 ? <p className="text-ink/60 border-t border-ink/10 pt-8">No orders yet.</p> : <div className="space-y-4">{orders.map((order) => <article key={order._id} className="bg-white border border-ink/10 rounded-lg p-5"><div className="flex flex-wrap justify-between gap-3 mb-4"><div><p className="font-mono text-xs text-ink/60">#{order._id}</p><p className="text-xs text-ink/45 mt-1">{new Date(order.createdAt).toLocaleString()}</p></div><div className="text-right"><p className="font-display text-xl">₹{order.totalAmount.toFixed(0)}</p><p className="text-xs text-ink/55">{order.paymentStatus} · {order.orderStatus}</p></div></div><div className="text-sm text-ink/70">{order.items.map((item) => <span key={item._id} className="mr-4">{item.name} x {item.quantity}</span>)}</div></article>)}</div>}</div>;
};

export default MyOrders;
