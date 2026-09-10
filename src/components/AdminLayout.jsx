import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col md:flex-row bg-paper-dim">
    <AdminSidebar />
    <main className="flex-1 p-6 sm:p-10">{children}</main>
  </div>
);

export default AdminLayout;
