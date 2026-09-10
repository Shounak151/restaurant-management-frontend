import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const MenuItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchItems = (query = "") => {
    setLoading(true);
    api
      .get("/menu-items", { params: query ? { search: query } : {} })
      .then(({ data }) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchItems(search), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the menu? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/menu-items/${id}`);
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't remove this item.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">MENU MANAGEMENT</p>
          <h1 className="font-display text-3xl text-ink">Menu items</h1>
        </div>
        <Link
          to="/admin/menu-items/new"
          className="px-5 py-2.5 rounded-full bg-ink text-paper text-sm hover:bg-ink-soft transition-colors"
        >
          + Add menu item
        </Link>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search menu items…"
        className="w-full sm:w-80 px-4 py-2.5 rounded-full border border-ink/15 bg-white text-sm focus:border-gold outline-none mb-6"
      />

      {loading ? (
        <Loader label="Loading menu items" />
      ) : items.length === 0 ? (
        <EmptyState
          title="No menu items yet"
          description="Add your first dish to get it showing on the public menu."
          action={
            <Link to="/admin/menu-items/new" className="text-sm text-gold-dark hover:underline">
              + Add menu item
            </Link>
          }
        />
      ) : (
        <div className="bg-white border border-ink/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-ink/50">
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3 flex items-center gap-3">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover border border-ink/10" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-paper-dim border border-ink/10" />
                    )}
                    <span className="text-ink font-medium">{item.name}</span>
                  </td>
                  <td className="px-5 py-3 text-ink/70">{item.category}</td>
                  <td className="px-5 py-3 text-ink/70">₹{Number(item.price).toFixed(0)}</td>
                  <td className="px-5 py-3">
                    {item.availability ? (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-herb/10 text-herb">In stock</span>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-brick/10 text-brick">Out of stock</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                    <Link to={`/admin/menu-items/${item._id}/edit`} className="text-gold-dark hover:underline">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id, item.name)}
                      disabled={deletingId === item._id}
                      className="text-brick hover:underline disabled:opacity-50"
                    >
                      {deletingId === item._id ? "Removing…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MenuItemsList;
