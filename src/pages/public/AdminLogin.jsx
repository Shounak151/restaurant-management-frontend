import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(form.email, form.password);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Access denied — check your admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-herb-dark flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-paper rounded-lg p-8 shadow-xl">
        <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">STAFF ONLY</p>
        <h1 className="font-display text-2xl text-ink mb-6">Admin sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink/60 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-md border border-ink/15 bg-white focus:border-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-ink/60 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-md border border-ink/15 bg-white focus:border-gold outline-none"
            />
          </div>

          {error && <p className="text-sm text-brick">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-herb text-paper text-sm hover:bg-herb-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-ink/40 mt-6 text-center">
          <Link to="/" className="hover:text-ink/60">← Back to the restaurant</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
