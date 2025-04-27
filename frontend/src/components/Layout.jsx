import { useEffect, useState } from "react";
import { Layout, Menu, Button, Typography, Avatar, Tag, Space } from "antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ScheduleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { setUserInfo } from "../redux/actions/userActions";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await api.get("auth/me");
        dispatch(setUserInfo(res?.data));
      } catch (e) {
        console.error("Error fetching user data.");
      }
    };
    getUserData();
  }, [dispatch]);

  const user = useSelector((state) => state.user);

  const getSelectedKeys = () => {
    const path = location.pathname;
    if (path === "/dashboard") return ["2"];
    if (path === "/feed") return ["1"];
    if (path === "/admin") return ["3"];
    return [];
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        style={{
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "16px",
            fontWeight: "bold",
            fontSize: "18px",
            color: "#fff",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "6px",
          }}
        >
          {collapsed ? "V" : "VertxAI "}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={getSelectedKeys()}>
          <Menu.Item key="1" icon={<ScheduleOutlined />}>
            <Link to="/feed">Feed</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          {user?.role === "admin" && (
            <Menu.Item key="3" icon={<SettingOutlined />}>
              <Link to="/admin">Admin</Link>
            </Menu.Item>
          )}
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "0.3s" }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Sidebar Toggle Button */}
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "18px", marginRight: "16px" }}
            />
            <Avatar size="large" icon={<UserOutlined />} />
            <Title level={4} style={{ margin: "0 0 0 10px" }}>
              {user?.username ? user?.username : "VertxAI"}
            </Title>
          </div>
          <Space>
            <Tag color="green">🎯 Credits: {user?.credits ?? 0}</Tag>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Space>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: 280,
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
