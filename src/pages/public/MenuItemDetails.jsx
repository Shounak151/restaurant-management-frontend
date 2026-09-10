import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const MenuItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    api
      .get(`/menu-items/${id}`)
      .then(({ data }) => mounted && setItem(data))
      .catch(() => mounted && setError("This dish couldn't be found — it may have been removed from the menu."))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <Loader label="Fetching the dish" />;

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <p className="font-display text-2xl text-ink mb-3">Not on the menu</p>
        <p className="text-ink/60 mb-6">{error}</p>
        <Link to="/menu" className="text-gold-dark hover:underline text-sm">← Back to the menu</Link>
      </div>
    );
  }

  const outOfStock = item.availability === false;

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
      <Link to="/menu" className="text-sm text-ink/50 hover:text-ink transition-colors">← Back to menu</Link>

      <div className="mt-6 grid md:grid-cols-2 gap-10 items-start">
        <div className="aspect-square rounded-lg overflow-hidden border border-ink/10 bg-paper-dim">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/30 text-sm">
              No photo available
            </div>
          )}
        </div>

        <div>
          <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">{item.category?.toUpperCase()}</p>
          <h1 className="font-display text-4xl text-ink leading-tight">{item.name}</h1>
          <p className="font-display text-2xl text-ink mt-4">₹{Number(item.price).toFixed(0)}</p>

          <p className="text-ink/70 mt-6 leading-relaxed">{item.description}</p>

          <div className="mt-8">
            {outOfStock ? (
              <span className="inline-block px-4 py-2 rounded-full bg-brick/10 text-brick text-sm font-medium">
                Currently out of stock
              </span>
            ) : (
              <span className="inline-block px-4 py-2 rounded-full bg-herb/10 text-herb text-sm font-medium">
                Available now
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetails;
