import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import AppLayout from "../components/Layout";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import AdminPanel from "../pages/AdminPanel";
import FeedPage from "../pages/FeedPage";

const AppRoutes = () => (
  <Routes>
    {/* Public Route */}
    <Route path="/login" element={<Login />} />
    {/* Protected Routes */}
    <Route element={<PrivateRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/feed" element={<FeedPage />} />
      </Route>
    </Route>

    {/* Redirect all unknown routes to /login */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;
