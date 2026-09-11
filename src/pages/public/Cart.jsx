import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Loader from "../../components/Loader";

const Cart = () => {
  const { cart, loading, updateQuantity, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (loading) return <Loader label="Opening your cart" />;
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
      <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">YOUR TABLE</p>
      <h1 className="font-display text-4xl text-ink mb-8">Cart</h1>
      {cart.items.length === 0 ? (
        <div className="border-t border-ink/10 py-16 text-center">
          <p className="font-display text-2xl text-ink mb-3">Your cart is empty</p>
          <Link to="/menu" className="text-sm text-gold-dark hover:underline">Browse the menu</Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_300px] gap-10 items-start">
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {cart.items.map(({ menuItem, quantity }) => (
              <div key={menuItem._id} className="py-5 flex gap-4 items-center">
                {menuItem.image ? <img src={menuItem.image} alt={menuItem.name} className="w-16 h-16 object-cover rounded-md" /> : <div className="w-16 h-16 rounded-md bg-paper-dim" />}
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg truncate">{menuItem.name}</p>
                  <p className="text-sm text-ink/60">₹{Number(menuItem.price).toFixed(0)} each</p>
                </div>
                <div className="flex items-center gap-2 border border-ink/15 rounded-full px-2 py-1">
                  <button aria-label={`Decrease ${menuItem.name}`} onClick={() => updateQuantity(menuItem._id, quantity - 1)} className="w-6 h-6 text-lg">-</button>
                  <span className="w-5 text-center text-sm">{quantity}</span>
                  <button aria-label={`Increase ${menuItem.name}`} onClick={() => updateQuantity(menuItem._id, quantity + 1)} disabled={quantity >= 20} className="w-6 h-6 text-lg disabled:opacity-30">+</button>
                </div>
                <div className="text-right w-20">
                  <p className="font-display">₹{(menuItem.price * quantity).toFixed(0)}</p>
                  <button onClick={() => removeItem(menuItem._id)} className="text-xs text-brick hover:underline">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-ink/10 rounded-lg p-6">
            <div className="flex justify-between items-center mb-5"><span className="text-ink/60">Total</span><strong className="font-display text-2xl">₹{total.toFixed(0)}</strong></div>
            <button onClick={() => navigate("/checkout")} className="w-full py-3 rounded-full bg-ink text-paper text-sm hover:bg-ink-soft">Continue order</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
