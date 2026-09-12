import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import socket, { connectSocket } from "../socket";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors ${
    isActive ? "bg-paper/10 text-paper font-medium" : "text-paper/60 hover:text-paper hover:bg-paper/5"
  }`;

const routeNotification = {
  "/admin/users": "NEW_CUSTOMER",
  "/admin/orders": "NEW_ORDER",
  "/admin/support-tickets": "SUPPORT_TICKET",
  "/admin/live-support": "LIVE_SUPPORT_MESSAGE",
};

const badgeClass = "ml-auto min-w-5 rounded-full bg-gold px-1.5 py-0.5 text-center text-[10px] font-semibold text-ink";

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [counts, setCounts] = useState({ users: 0, orders: 0, support: 0, liveSupport: 0 });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const { data } = await api.get("/admin/notifications/counts");
        setCounts(data);
      } catch (_) {
        // Keep the navigation usable if notifications are unavailable.
      }
    };

    const onCounts = (nextCounts) => setCounts(nextCounts);
    connectSocket();
    socket.on("admin:notification-counts", onCounts);
    loadCounts();

    return () => socket.off("admin:notification-counts", onCounts);
  }, [user?._id]);

  useEffect(() => {
    const type = routeNotification[location.pathname];
    if (!type) return;

    api.patch("/admin/notifications/read", { types: [type] })
      .then(({ data }) => setCounts(data.counts))
      .catch(() => {});
  }, [location.pathname]);

  const navItem = (label, to, countKey) => (
    <NavLink to={to} className={linkClass}>
      <span>{label}</span>
      {counts[countKey] > 0 && <span className={badgeClass}>{counts[countKey]}</span>}
    </NavLink>
  );

  return (
    <aside className="w-full md:w-60 md:min-h-screen bg-herb-dark text-paper flex md:flex-col flex-row md:py-8 py-4 px-4 md:px-4 gap-2 md:gap-1">
      <div className="hidden md:block px-4 mb-6">
        <p className="font-display text-xl text-paper">TastyBites</p>
        <p className="text-xs text-paper/50 tracking-wide">STAFF PANEL</p>
      </div>

      <nav className="flex md:flex-col flex-row gap-1 flex-1 overflow-x-auto">
        <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/admin/menu-items" className={linkClass}>Menu items</NavLink>
        {navItem("Users", "/admin/users", "users")}
        {navItem("Orders", "/admin/orders", "orders")}
        {navItem("Support", "/admin/support-tickets", "support")}
        {navItem("Live Support", "/admin/live-support", "liveSupport")}
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
