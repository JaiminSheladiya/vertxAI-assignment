import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Statistic, List, Tag, Space } from "antd";
import {
  SaveOutlined,
  FlagOutlined,
  ClockCircleOutlined,
  LinkOutlined, // For clickable links
} from "@ant-design/icons";
import api from "../utils/api";

const { Title, Text } = Typography;

const typeMap = {
  save: { label: "Saved a post", color: "green", icon: <SaveOutlined /> },
  report: { label: "Reported a post", color: "red", icon: <FlagOutlined /> },
};

const UserDashboard = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  console.log("savedPosts: ", savedPosts);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get(`/activity/user/${user._id}`);
        setActivities(res.data);
      } catch (err) {
        console.error("Failed to load user activity", err);
      }
    };

    const fetchSavedPosts = async () => {
      try {
        const res = await api.get(`/posts/saved-posts`, {
          params: { userId: user._id },
        });
        setSavedPosts(res.data.savedPosts);
      } catch (err) {
        console.error("Failed to load saved posts", err);
      }
    };

    if (user?._id) {
      fetchActivity();
      fetchSavedPosts();
    }
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

export default UserDashboard;
