import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const { user } = useAuth();
  const { cart, total } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const placeOrder = async (event) => {
    event.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const { data: order } = await api.post("/orders", { deliveryAddress: address });
      try {
        const { data: payment } = await api.post(`/orders/${order._id}/payment`);
        if (!window.Razorpay) {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => openPayment(order, payment);
          script.onerror = () => navigate(`/order-confirmation/${order._id}`);
          document.body.appendChild(script);
        } else openPayment(order, payment);
      } catch (paymentError) {
        setError(paymentError.response?.data?.message || "Online payment is currently unavailable. Please try again later.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "We couldn't place that order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const openPayment = (order, payment) => {
    const razorpay = new window.Razorpay({
      key: payment.key,
      amount: payment.amount,
      currency: payment.currency,
      name: "TastyBites",
      description: `Order ${order._id.slice(-8).toUpperCase()}`,
      order_id: payment.paymentOrderId,
      prefill: { name: user.name, email: user.email },
      handler: async (response) => {
        try {
          await api.post(`/orders/${order._id}/verify-payment`, response);
        } catch (_) {
          setError("Payment could not be verified. Please contact support with your order ID.");
        }
        navigate(`/order-confirmation/${order._id}`);
      },
      modal: { ondismiss: () => navigate(`/order-confirmation/${order._id}`) },
    });
    razorpay.open();
  };

  if (!cart.items.length) return <div className="max-w-2xl mx-auto px-5 py-20 text-center"><p className="font-display text-2xl mb-4">Your cart is empty</p><Link to="/menu" className="text-gold-dark">Browse the menu</Link></div>;
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
      <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">ALMOST THERE</p>
      <h1 className="font-display text-4xl text-ink mb-8">Checkout</h1>
      <form onSubmit={placeOrder} className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        <div className="space-y-8">
          <section className="border-t border-ink/10 pt-5">
            <h2 className="font-display text-xl mb-4">Customer details</h2>
            <div className="grid sm:grid-cols-2 gap-4"><div><p className="text-xs text-ink/50 mb-1">Name</p><p className="text-sm">{user.name}</p></div><div><p className="text-xs text-ink/50 mb-1">Email</p><p className="text-sm">{user.email}</p></div></div>
          </section>
          <section className="border-t border-ink/10 pt-5"><label className="font-display text-xl block mb-4" htmlFor="address">Delivery address</label><textarea id="address" required minLength={8} maxLength={300} value={address} onChange={(event) => setAddress(event.target.value)} rows="4" placeholder="House, street, city and PIN code" className="w-full px-4 py-3 rounded-md border border-ink/15 bg-white outline-none focus:border-gold" /></section>
          <section className="border-t border-ink/10 pt-5"><h2 className="font-display text-xl mb-4">Payment</h2><label className="flex items-center gap-3 border border-gold bg-gold/10 rounded-md px-4 py-3"><input type="radio" name="paymentMethod" value="razorpay" checked={paymentMethod === "razorpay"} onChange={(event) => setPaymentMethod(event.target.value)} /><span><span className="block text-sm font-medium">Pay online with Razorpay</span><span className="block text-xs text-ink/55 mt-1">Secure card, UPI or net banking payment</span></span></label></section>
          {error && <p className="text-sm text-brick">{error}</p>}
        </div>
        <aside className="bg-white border border-ink/10 rounded-lg p-6"><h2 className="font-display text-xl mb-4">Order summary</h2><div className="space-y-3 mb-5">{cart.items.map(({ menuItem, quantity }) => <div key={menuItem._id} className="flex justify-between gap-3 text-sm"><span>{menuItem.name} x {quantity}</span><span>₹{(menuItem.price * quantity).toFixed(0)}</span></div>)}</div><div className="border-t border-ink/10 pt-4 flex justify-between font-medium"><span>Total to pay</span><span>₹{total.toFixed(0)}</span></div><button disabled={placing || paymentMethod !== "razorpay"} className="w-full mt-6 py-3 rounded-full bg-ink text-paper text-sm disabled:opacity-50">{placing ? "Opening payment..." : "Place order and pay"}</button><p className="text-xs text-ink/45 mt-3 text-center">Your order is created after checkout and marked paid only after Razorpay verifies the payment.</p></aside>
      </form>
    </div>
  );
};

export default Checkout;
