import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors ${
    isActive ? "bg-paper/10 text-paper font-medium" : "text-paper/60 hover:text-paper hover:bg-paper/5"
  }`;

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-full md:w-60 md:min-h-screen bg-herb-dark text-paper flex md:flex-col flex-row md:py-8 py-4 px-4 md:px-4 gap-2 md:gap-1">
      <div className="hidden md:block px-4 mb-6">
        <p className="font-display text-xl text-paper">TastyBites</p>
        <p className="text-xs text-paper/50 tracking-wide">STAFF PANEL</p>
      </div>

      <nav className="flex md:flex-col flex-row gap-1 flex-1 overflow-x-auto">
        <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/admin/menu-items" className={linkClass}>Menu items</NavLink>
        <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
      </nav>

      <div className="hidden md:block mt-auto px-4 pt-4 border-t border-paper/10">
        <p className="text-sm text-paper/80">{user?.name}</p>
        <p className="text-xs text-paper/40 mb-3">{user?.email}</p>
        <button
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
          className="text-sm text-paper/60 hover:text-paper transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
