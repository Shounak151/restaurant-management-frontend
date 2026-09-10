import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    api
      .get("/users")
      .then(({ data }) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name}'s account? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't remove this user.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <p className="text-gold-dark text-sm tracking-[0.15em] mb-2">USER MANAGEMENT</p>
      <h1 className="font-display text-3xl text-ink mb-8">Registered users</h1>

      {loading ? (
        <Loader label="Loading users" />
      ) : users.length === 0 ? (
        <EmptyState title="No users yet" description="Once diners register on the public site, they'll show up here." />
      ) : (
        <div className="bg-white border border-ink/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-ink/50">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3 text-ink font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-ink/70">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${
                        u.role === "Admin" ? "bg-gold/15 text-gold-dark" : "bg-herb/10 text-herb"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink/60">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {u.role !== "Admin" && (
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        disabled={deletingId === u._id}
                        className="text-brick hover:underline disabled:opacity-50"
                      >
                        {deletingId === u._id ? "Removing…" : "Delete"}
                      </button>
                    )}
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

export default Users;
