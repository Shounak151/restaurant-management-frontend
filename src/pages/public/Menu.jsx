import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import MenuRow from "../../components/MenuRow";
import CategoryTabs from "../../components/CategoryTabs";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const params = {};
    if (category !== "All") params.category = category;
    if (search.trim()) params.search = search.trim();

    api
      .get("/menu-items", { params })
      .then(({ data }) => mounted && setItems(data))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [category, search]);

  const grouped = useMemo(() => {
    if (category !== "All") return { [category]: items };
    return items.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [items, category]);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
      <div className="mb-8">
        <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">THE MENU</p>
        <h1 className="font-display text-4xl text-ink">What's cooking</h1>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dishes…"
          className="w-full sm:w-80 px-4 py-2.5 rounded-full border border-ink/15 bg-white text-sm focus:border-gold outline-none"
        />
      </div>

      <CategoryTabs active={category} onChange={setCategory} />

      {loading ? (
        <Loader label="Bringing out the menu" />
      ) : items.length === 0 ? (
        <EmptyState
          title="No dishes match that"
          description="Try a different search term or category — or check back once the kitchen adds more items."
        />
      ) : (
        <div className="mt-4">
          {Object.entries(grouped).map(([cat, list]) => (
            <div key={cat} className="mb-10">
              <h2 className="font-display text-xl text-ink/80 mb-1">{cat}</h2>
              <div className="divide-y divide-ink/10">
                {list.map((item) => (
                  <MenuRow key={item._id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
