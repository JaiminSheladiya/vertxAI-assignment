import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Statistic, List, Tag, Text } from "antd";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { LinkOutlined } from "@ant-design/icons";

const { Title } = Typography;

const AdminDashboard = ({ analytics }) => {
  const [activities, setActivities] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  console.log('savedPosts: ', savedPosts);
  const user = useSelector((state) => state.user);
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

    const fetchSavedPosts = async () => {
      try {
        const res = await api.get("/posts/saved-posts", {
          params: { userId: user._id },
        });
        setSavedPosts(res.data.savedPosts);
      } catch (err) {
        console.error("Failed to fetch saved posts", err);
      }
    };

    fetchSavedPosts();
  }, []);

  return (
    <>
      {/* Top Analytics Cards */}
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

      {/* Activity + Saved Posts Section */}
      <Row gutter={[16, 16]} style={{ marginTop: "30px" }}>
        {/* Feed & User Activity */}
        <Col span={8}>
          <Card>
            <Title level={4}>Feed & User Activity</Title>
            {activities.length === 0 ? (
              <Typography.Text type="secondary">
                No activity recorded yet.
              </Typography.Text>
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
                            {activity?.details || ""}
                          </div>
                        </>
                      }
                      description={new Date(
                        activity.timestamp
                      ).toLocaleString()}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Saved Posts Placeholder */}
        <Col span={16}>
          <Card>
            <Title level={4}>Saved Posts</Title>

            {savedPosts.length === 0 ? (
              <Typography.Text type="secondary">
                No saved posts available.
              </Typography.Text>
            ) : (
              <List
                itemLayout="vertical"
                dataSource={savedPosts}
                renderItem={(post) => (
                  <List.Item
                    key={post._id}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <List.Item.Meta
                      title={
                        post.source === "reddit" ? (
                          <a
                            href={post.data?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <LinkOutlined style={{ marginRight: 8 }} />{" "}
                            {/* Add Link icon */}
                            {post.data?.title}
                          </a>
                        ) : post.source === "twitter" ? (
                          <a
                            href={`https://twitter.com/i/web/status/${post.data?.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <LinkOutlined style={{ marginRight: 8 }} />{" "}
                            {/* Add Link icon */}
                            Tweet
                          </a>
                        ) : (
                          <span>Unknown Source</span>
                        )
                      }
                      description={
                        <>
                          {post.source === "reddit" && (
                            <Tag color="purple">{post.data?.subreddit}</Tag>
                          )}
                          {post.source === "twitter" && (
                            <Tag color="blue">Twitter</Tag>
                          )}
                          <Tag color="green">Saved by: {post.savedBy}</Tag>
                          <br />
                          <Typography.Text type="secondary">
                            {new Date(post.createdAt).toLocaleString()}
                          </Typography.Text>
                        </>
                      }
                    />
                    <div style={{ marginTop: 8 }}>
                      <Typography.Paragraph ellipsis={{ rows: 2 }}>
                        {post.source === "reddit" && post.data?.selftext}
                        {post.source === "twitter" && post.data?.text}
                      </Typography.Paragraph>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;
