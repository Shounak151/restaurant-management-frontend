import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/dashboard/stats")
      .then(({ data }) => mounted && setStats(data))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">OVERVIEW</p>
      <h1 className="font-display text-3xl text-ink mb-1">Good to see you, {user?.name?.split(" ")[0]}</h1>
      <p className="text-ink/50 mb-8">Here's how the kitchen and floor look today.</p>

      {loading ? (
        <Loader label="Pulling the numbers" />
      ) : (
        <div className="grid sm:grid-cols-3 gap-5">
          <StatCard label="Total menu items" value={stats?.totalMenuItems ?? 0} hint="Across all categories" />
          <StatCard label="Registered users" value={stats?.totalUsers ?? 0} hint="Excludes staff accounts" />
          <StatCard label="Total orders" value={stats?.totalOrders ?? 0} hint="Coming in a future update" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
