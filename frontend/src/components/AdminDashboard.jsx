import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Statistic, List, Tag } from "antd";
import api from "../utils/api";

const { Title, Text } = Typography;

const AdminDashboard = ({ analytics }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get("/admin/activities");
        setActivities(res.data);
      } catch (err) {
        console.error("Failed to load admin activity", err);
      }
    };

    fetchActivities();
  }, []);
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={6}>
          <Card bordered hoverable>
            <Statistic
              title="Total Users"
              value={analytics?.totalUsers || 0}
              valueStyle={{ color: "#722ed1", fontWeight: 600 }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card bordered hoverable>
            <Statistic
              title="Total Feed Posts"
              value={analytics?.totalFeeds || 0}
              valueStyle={{ color: "#eb2f96", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered hoverable>
            <Statistic
              title="Total Reported Posts"
              value={analytics?.totalReportedPosts || 0}
              valueStyle={{ color: "#f5222d", fontWeight: 600 }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card bordered hoverable>
            <Statistic
              title="Total Saved Posts"
              value={analytics?.totalSavedPosts || 0}
              valueStyle={{ color: "#3f8600", fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: "30px" }}>
        <Title level={4}>Feed & User Activity</Title>

        {activities.length === 0 ? (
          <Text type="secondary">No activity recorded yet.</Text>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={activities}
            renderItem={(activity) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <>
                      <Tag color="blue">{activity.type}</Tag>{" "}
                      {activity.userId?.username}
                      <div style={{ fontWeight: "400", color: "grey" }}>
                        {activity?.details ? activity.details : ""}
                      </div>
                    </>
                  }
                  description={new Date(activity.timestamp).toLocaleString()}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </>
  );
};

export default AdminDashboard;
