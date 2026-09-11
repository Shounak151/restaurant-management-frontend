import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => { api.get("/orders/mine").then(({ data }) => setOrder(data.find((item) => item._id === id))).catch(() => {}); }, [id]);
  if (!order) return <Loader label="Loading your order" />;
  return <div className="max-w-2xl mx-auto px-5 py-20 text-center"><p className="text-gold-dark text-sm tracking-[0.15em] mb-3">ORDER RECEIVED</p><h1 className="font-display text-4xl text-ink mb-4">Thank you, {order.user?.name || "friend"}.</h1><p className="text-ink/60 mb-2">Your order ID is</p><p className="font-mono text-sm bg-paper-dim inline-block px-3 py-2 rounded-md mb-6">{order._id}</p><p className="text-sm text-ink/60 mb-8">Payment: {order.paymentStatus}. We will keep you posted as the kitchen prepares your food.</p><div className="flex justify-center gap-3"><Link to="/my-orders" className="px-5 py-2.5 rounded-full bg-ink text-paper text-sm">View my orders</Link><Link to="/menu" className="px-5 py-2.5 rounded-full border border-ink/20 text-sm">Back to menu</Link></div></div>;
};

export default OrderConfirmation;
