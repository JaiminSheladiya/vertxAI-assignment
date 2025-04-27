import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Tag,
  Space,
  Typography,
  Input,
  Popover,
} from "antd";
import api from "../utils/api";

const { Title } = Typography;

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [editableCreditUser, setEditableCreditUser] = useState(null);
  const [creditInput, setCreditInput] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      message.error("Failed to fetch users");
    }
  };

  const makeAdmin = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: "admin" });
      message.success("User promoted to admin");
      fetchUsers();
    } catch {
      message.error("Failed to update role");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      message.success("User deleted");
      fetchUsers();
    } catch {
      message.error("Failed to delete user");
    }
  };

  const updateCredits = async (userId, newCredits) => {
    try {
      // Dummy PATCH request
      await api.patch(`/admin/users/${userId}/credits`, {
        credits: newCredits,
      });
      message.success("Credits updated");
      setEditableCreditUser(null);
      fetchUsers();
    } catch {
      message.error("Failed to update credits");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "geekblue" : "default"}>{role}</Tag>
      ),
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
      render: (credits, user) => (
        <Popover
          content={
            <div style={{ display: "flex", gap: "8px" }}>
              <Input
                size="small"
                type="number"
                value={creditInput}
                onChange={(e) => setCreditInput(e.target.value)}
                placeholder="New credits"
              />
              <Button
                type="primary"
                size="small"
                onClick={() => updateCredits(user._id, creditInput)}
              >
                Save
              </Button>
            </div>
          }
          title="Edit Credits"
          trigger="click"
          open={editableCreditUser === user._id}
          onOpenChange={(open) => {
            if (open) {
              setEditableCreditUser(user._id);
              setCreditInput(credits);
            } else {
              setEditableCreditUser(null);
            }
          }}
        >
          <Tag color="gold" style={{ cursor: "pointer" }}>
            {credits}
          </Tag>
        </Popover>
      ),
    },
    {
      title: "Saved Posts",
      dataIndex: "savedPosts",
      key: "savedPosts",
      render: (savedPosts) => savedPosts.length,
    },
    {
      title: "Reported Posts",
      dataIndex: "reportedPosts",
      key: "reportedPosts",
      render: (reportedPosts) => reportedPosts.length,
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin) => new Date(lastLogin).toLocaleString(),
    },
    {
      title: "Reward Claimed Today",
      dataIndex: "rewardClaimedToday",
      key: "rewardClaimedToday",
      render: (rewardClaimedToday) => (
        <Tag color={rewardClaimedToday ? "green" : "red"}>
          {rewardClaimedToday ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <Space>
          {user.role !== "admin" && (
            <Button size="small" onClick={() => makeAdmin(user._id)}>
              Make Admin
            </Button>
          )}
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteUser(user._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "0 20px" }}>
      <Title level={3}>Admin Panel - User Management</Title>
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <Tag
          color="green"
          style={{ fontSize: "14px", padding: "0.5rem 1.25rem" }}
        >
          💡 Click on <strong>Credits</strong> tag to edit a user's credits
        </Tag>
      </Space>
      <Table columns={columns} dataSource={users} rowKey="_id" />
    </div>
  );
};

export default AdminPanel;
