import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Statistic, List, Tag, Space } from "antd";
import {
  SaveOutlined,
  FlagOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import api from "../utils/api";

const { Title, Text } = Typography;

const typeMap = {
  save: { label: "Saved a post", color: "green", icon: <SaveOutlined /> },
  report: { label: "Reported a post", color: "red", icon: <FlagOutlined /> },
};

const UserDashboard = ({ user }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get(`/activity/user/${user._id}`);
        setActivities(res.data);
      } catch (err) {
        console.error("Failed to load user activity", err);
      }
    };

    if (user?._id) fetchActivity();
  }, [user]);

  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={8}>
          <Card bordered hoverable>
            <Statistic
              title="Your Credit Balance"
              value={user?.credits || 0}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              suffix="pts"
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card bordered hoverable>
            <Statistic
              title="Saved Posts"
              value={user?.savedPosts?.length || 0}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card bordered hoverable>
            <Statistic
              title="Daily Reward Claimed"
              value={user?.rewardClaimedToday ? "Yes" : "No"}
              valueStyle={{
                color: user?.rewardClaimedToday ? "#52c41a" : "#f5222d",
              }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: "30px" }}>
        <Title level={4}>Recent Activity</Title>
        {activities.length === 0 ? (
          <Text type="secondary">No activity yet.</Text>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={activities}
            renderItem={(activity) => {
              const info = typeMap[activity.type] || {
                label: activity.type,
                color: "blue",
              };

              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Tag color={info.color} icon={info.icon}>
                        {activity.type}
                      </Tag>
                    }
                    title={
                      <Text>
                        {info.label}
                        {activity.postId?.title && (
                          <>
                            {" "}
                            on post "<strong>{activity.postId.title}</strong>"
                          </>
                        )}
                      </Text>
                    }
                    description={
                      <Space>
                        <ClockCircleOutlined />
                        <Text type="secondary">
                          {new Date(activity.timestamp).toLocaleString()}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>
    </>
  );
};

export default UserDashboard;
