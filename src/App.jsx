import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Home from "./pages/public/Home";
import Menu from "./pages/public/Menu";
import MenuItemDetails from "./pages/public/MenuItemDetails";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register"; 
import AdminLogin from "./pages/public/AdminLogin";
import Cart from "./pages/public/Cart";
import Checkout from "./pages/public/Checkout";
import MyOrders from "./pages/public/MyOrders";
import OrderConfirmation from "./pages/public/OrderConfirmation";

import Dashboard from "./pages/admin/Dashboard";
import MenuItemsList from "./pages/admin/MenuItemsList";
import MenuItemForm from "./pages/admin/MenuItemForm";
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";
import SupportTickets from "./pages/admin/SupportTickets";
import LiveSupport from "./pages/admin/LiveSupport";
import Chatbot from "./components/Chatbot";

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <>
      <Routes>
      {/* Public site */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/menu" element={<PublicLayout><Menu /></PublicLayout>} />
      <Route path="/menu/:id" element={<PublicLayout><MenuItemDetails /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/cart" element={<ProtectedRoute><PublicLayout><Cart /></PublicLayout></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><PublicLayout><Checkout /></PublicLayout></ProtectedRoute>} />
      <Route path="/my-orders" element={<ProtectedRoute><PublicLayout><MyOrders /></PublicLayout></ProtectedRoute>} />
      <Route path="/order-confirmation/:id" element={<ProtectedRoute><PublicLayout><OrderConfirmation /></PublicLayout></ProtectedRoute>} />

      {/* Admin panel (protected) */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout><Dashboard /></AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/menu-items"
        element={
          <AdminProtectedRoute>
            <AdminLayout><MenuItemsList /></AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/menu-items/new"
        element={
          <AdminProtectedRoute>
            <AdminLayout><MenuItemForm /></AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/menu-items/:id/edit"
        element={
          <AdminProtectedRoute>
            <AdminLayout><MenuItemForm /></AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <AdminLayout><Users /></AdminLayout>
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminProtectedRoute>
            <AdminLayout><Orders /></AdminLayout>
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/support-tickets"
        element={
          <AdminProtectedRoute>
            <AdminLayout><SupportTickets /></AdminLayout>
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/live-support"
        element={
          <AdminProtectedRoute>
            <AdminLayout><LiveSupport /></AdminLayout>
          </AdminProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <div className="max-w-2xl mx-auto px-5 py-24 text-center">
              <p className="font-display text-3xl text-ink mb-3">Page not found</p>
              <p className="text-ink/60">The page you're looking for doesn't exist.</p>
            </div>
          </PublicLayout>
        }
      />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
