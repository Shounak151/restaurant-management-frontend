import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `text-sm tracking-wide transition-colors ${
    isActive ? "text-ink font-semibold" : "text-ink/60 hover:text-ink"
  }`;

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <header className="border-b border-ink/10 bg-paper/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold text-ink">TastyBites</span>
          <span className="hidden sm:inline text-xs text-gold-dark tracking-[0.15em]">KITCHEN &amp; TABLE</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/menu" className={navLinkClass}>Menu</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>Dashboard</NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-ink/70">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-full border border-ink/20 hover:border-ink/40 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm px-4 py-2 text-ink/70 hover:text-ink transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm px-5 py-2 rounded-full bg-ink text-paper hover:bg-ink-soft transition-colors"
              >
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink/10 px-5 py-4 flex flex-col gap-4 bg-paper">
          <NavLink to="/" end className={navLinkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/menu" className={navLinkClass} onClick={() => setOpen(false)}>Menu</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
          )}
          <div className="h-px bg-ink/10 my-1" />
          {user ? (
            <button onClick={handleLogout} className="text-left text-sm text-ink/70">Log out</button>
          ) : (
            <>
              <Link to="/login" className="text-sm text-ink/70" onClick={() => setOpen(false)}>Log in</Link>
              <Link to="/register" className="text-sm text-gold-dark font-medium" onClick={() => setOpen(false)}>Create account</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
