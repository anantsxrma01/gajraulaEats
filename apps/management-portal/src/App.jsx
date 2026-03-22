import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import OrdersList from "./pages/orders/OrdersList";
import OrderDetail from "./pages/orders/OrderDetail";
import TicketsList from "./pages/tickets/TicketsList";
import TicketDetail from "./pages/tickets/TicketDetail";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
                <Layout>
                  <Navigate to="/orders" replace />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
                <Layout>
                  <OrdersList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
                <Layout>
                  <OrderDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
                <Layout>
                  <TicketsList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/:id"
            element={
              <ProtectedRoute allowedRoles={["OWNER", "MANAGER"]}>
                <Layout>
                  <TicketDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/orders" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}