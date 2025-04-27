import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography } from "antd";
import AdminDashboard from "../components/AdminDashboard";
import UserDashboard from "../components/UserDashboard";
import api from "../utils/api";

const { Title } = Typography;

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const isAdmin = user?.role === "admin";
  console.log("isAdmin: ", isAdmin);

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      const fetchAdminStats = async () => {
        try {
          const res = await api.get("/admin/analytics");
          setAnalytics(res.data);
        } catch (err) {
          console.error("Failed to fetch admin analytics", err);
        }
      };
      fetchAdminStats();
    }
  }, [isAdmin]);

  return (
    <div>
      <Title level={2}>Welcome back, {user?.username} 👋</Title>
      {isAdmin ? (
        <AdminDashboard analytics={analytics} />
      ) : (
        <UserDashboard user={user} />
      )}
    </div>
  );
};

export default Dashboard;
