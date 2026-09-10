import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/Loader";

const CATEGORIES = ["Starter", "Main Course", "Dessert", "Beverage"];

const MenuItemForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Starter",
    price: "",
    availability: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/menu-items/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name,
          description: data.description,
          category: data.category,
          price: data.price,
          availability: data.availability,
        });
        setExistingImage(data.image);
      })
      .catch(() => setError("Couldn't load this menu item."))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("description", form.description);
    payload.append("category", form.category);
    payload.append("price", form.price);
    payload.append("availability", form.availability);
    if (imageFile) payload.append("image", imageFile);

    try {
      if (isEdit) {
        await api.put(`/menu-items/${id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/menu-items", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/admin/menu-items");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save this menu item. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading item" />;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/menu-items" className="text-sm text-ink/50 hover:text-ink transition-colors">
        ← Back to menu items
      </Link>

      <p className="text-gold-dark text-sm tracking-[0.15em] mt-4 mb-2">
        {isEdit ? "EDIT DISH" : "NEW DISH"}
      </p>
      <h1 className="font-display text-3xl text-ink mb-8">
        {isEdit ? `Editing ${form.name}` : "Add a menu item"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-ink/10 rounded-lg p-6">
        <div>
          <label className="block text-sm text-ink/60 mb-1">Item name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={update("name")}
            className="w-full px-4 py-2.5 rounded-md border border-ink/15 focus:border-gold outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-ink/60 mb-1">Description</label>
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={update("description")}
            className="w-full px-4 py-2.5 rounded-md border border-ink/15 focus:border-gold outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink/60 mb-1">Category</label>
            <select
              value={form.category}
              onChange={update("category")}
              className="w-full px-4 py-2.5 rounded-md border border-ink/15 focus:border-gold outline-none bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-ink/60 mb-1">Price (₹)</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={update("price")}
              className="w-full px-4 py-2.5 rounded-md border border-ink/15 focus:border-gold outline-none"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={form.availability} onChange={update("availability")} className="w-4 h-4" />
          In stock and available to order
        </label>

        <div>
          <label className="block text-sm text-ink/60 mb-1">Photo</label>
          {existingImage && !imageFile && (
            <img src={existingImage} alt="Current" className="w-24 h-24 rounded-md object-cover border border-ink/10 mb-3" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="text-sm"
          />
          <p className="text-xs text-ink/40 mt-1">
            {isEdit ? "Leave empty to keep the current photo." : "JPG, PNG or WEBP, up to 5MB."}
          </p>
        </div>

        {error && <p className="text-sm text-brick">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-ink text-paper text-sm hover:bg-ink-soft transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add to menu"}
          </button>
          <Link
            to="/admin/menu-items"
            className="px-6 py-2.5 rounded-full border border-ink/15 text-sm text-ink/70 hover:border-ink/30 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default MenuItemForm;
