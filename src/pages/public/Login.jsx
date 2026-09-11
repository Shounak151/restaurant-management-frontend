import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't log you in — check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">WELCOME BACK</p>
      <h1 className="font-display text-3xl text-ink mb-8">Log in</h1>
      {location.state?.message && <p className="mb-5 rounded-md bg-gold/15 px-4 py-3 text-sm text-ink">{location.state.message}</p>}

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
          className="w-full py-3 rounded-full bg-ink text-paper text-sm hover:bg-ink-soft transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        New here?{" "}
        <Link to="/register" className="text-gold-dark hover:underline">
          Create an account
        </Link>
      </p>
      <p className="text-sm text-ink/40 mt-2">
        <Link to="/admin/login" className="hover:text-ink/60">Staff login →</Link>
      </p>
    </div>
  );
};

export default Login;
