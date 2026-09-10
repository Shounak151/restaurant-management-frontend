import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import MenuRow from "../../components/MenuRow";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/menu-items")
      .then(({ data }) => {
        if (mounted) setItems(data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const featured = items.slice(0, 5);
  const categoryCount = new Set(items.map((i) => i.category)).size;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid md:grid-cols-[1.3fr,1fr] gap-12 items-end">
          <div>
            <p className="text-gold-dark text-sm tracking-[0.15em] mb-4">TASTYBITES · EST. TODAY</p>
            <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-ink">
              Good food,
              <br />
              honestly plated.
            </h1>
            <p className="mt-6 text-ink/60 max-w-md text-base leading-relaxed">
              A short, seasonal menu cooked to order — browse what's on the pass today,
              no reservation or account needed.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/menu"
                className="px-6 py-3 rounded-full bg-ink text-paper text-sm hover:bg-ink-soft transition-colors"
              >
                View full menu
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 rounded-full border border-ink/20 text-sm text-ink hover:border-ink/40 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>

          <div className="flex md:justify-end gap-10 text-ink">
            <div>
              <p className="font-display text-4xl">{items.length}</p>
              <p className="text-sm text-ink/50 mt-1">Dishes on the menu</p>
            </div>
            <div>
              <p className="font-display text-4xl">{categoryCount || 4}</p>
              <p className="text-sm text-ink/50 mt-1">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's picks */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">On the menu today</h2>
          <Link to="/menu" className="text-sm text-gold-dark hover:underline">
            See everything
          </Link>
        </div>

        {loading ? (
          <Loader label="Setting the table" />
        ) : featured.length === 0 ? (
          <EmptyState
            title="The menu is being written"
            description="Nothing has been added to the kitchen's menu yet. Check back soon, or if you're staff, sign in to add the first dish."
            action={
              <Link to="/admin/login" className="text-sm text-gold-dark hover:underline">
                Staff login →
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-ink/10">
            {featured.map((item) => (
              <MenuRow key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
