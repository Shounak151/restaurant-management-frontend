import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.confirmPassword);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">JOIN TASTYBITES</p>
      <h1 className="font-display text-3xl text-ink mb-8">Create an account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-ink/60 mb-1">Full name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={update("name")}
            className="w-full px-4 py-2.5 rounded-md border border-ink/15 bg-white focus:border-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-ink/60 mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            className="w-full px-4 py-2.5 rounded-md border border-ink/15 bg-white focus:border-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-ink/60 mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update("password")}
            className="w-full px-4 py-2.5 rounded-md border border-ink/15 bg-white focus:border-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm text-ink/60 mb-1">Confirm password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            className="w-full px-4 py-2.5 rounded-md border border-ink/15 bg-white focus:border-gold outline-none"
          />
        </div>

        {error && <p className="text-sm text-brick">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-ink text-paper text-sm hover:bg-ink-soft transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-gold-dark hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
