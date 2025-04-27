import React, { useState, useEffect } from "react";
import {
  Tabs,
  Card,
  Row,
  Col,
  Typography,
  Spin,
  message,
  Pagination,
  Tag,
} from "antd";
import {
  LinkOutlined,
  HeartFilled,
  HeartOutlined,
  WarningOutlined,
  WarningFilled,
} from "@ant-design/icons";
import api from "../utils/api";
import NoImage from "../assets/No-Image-Placeholder.png";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../redux/actions/userActions";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentSource, setCurrentSource] = useState("reddit");
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const fetchPosts = async (source, page = 1, showLoader) => {
    if (showLoader) setLoading(true);
    try {
      const res = await api.get(`/posts/${source}?page=${page}&limit=${limit}`);
      setPosts(res.data.posts);
      setTotalPosts(res.data.totalPosts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch posts!");
    }
  };

  useEffect(() => {
    fetchPosts(currentSource, page, true);
  }, [currentSource, page, limit]);

  const handleTabChange = (key) => {
    setCurrentSource(key);
    setPage(1);
    fetchPosts(key, 1);
  };

  const handlePaginationChange = (page) => {
    setPage(page);
    fetchPosts(currentSource, page);
  };

  const truncateText = (text, maxLength = 100) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const handleSave = async (postId) => {
    try {
      const { data } = await api.post("/posts/save-post", {
        userId: user._id,
        postId: postId,
      });
      dispatch(setUserInfo(data?.user));

      await fetchPosts(currentSource, page, false);
    } catch (e) {
      message.error("Something went wrong while saving the post!");
    }
  };

  const handleReport = async (postId) => {
    try {
      const { data } = await api.post("/posts/report-post", {
        userId: user._id,
        postId: postId,
      });
      dispatch(setUserInfo(data?.user));

      await fetchPosts(currentSource, page, false);
    } catch (e) {
      message.error("Something went wrong while reporting the post!");
    }
  };

  return (
    <div>
      <Title level={2}>Feed</Title>
      <Tabs defaultActiveKey="reddit" onChange={handleTabChange}>
        <TabPane tab="Reddit" key="reddit" />
        <TabPane tab="Twitter" key="twitter" />
      </Tabs>

      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Row gutter={16}>
            {posts.length === 0 ? (
              <Text>No posts available for this source.</Text>
            ) : (
              posts.map((post) => (
                <Col span={8} key={post._id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      marginBottom: "20px",
                      height: "auto",
                      overflow: "hidden",
                      position: "relative",
                    }}
                    cover={
                      <div style={{ position: "relative" }}>
                        {currentSource === "reddit" && (
                          <img
                            alt="Post"
                            src={
                              post.data.thumbnail &&
                              post.data.thumbnail !== "self"
                                ? post.data.thumbnail
                                : NoImage
                            }
                            onError={(e) => (e.target.src = NoImage)}
                            style={{
                              height: "200px",
                              width: "100%",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          />
                        )}

                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            left: "8px",
                            display: "flex",
                            gap: "5px",
                          }}
                        >
                          <Tag color="blue" style={{ margin: 0 }}>
                            {post.saved || 0} Saved
                          </Tag>
                          <Tag color="red" style={{ margin: 0 }}>
                            {post.reported || 0} Reported
                          </Tag>
                        </div>

                        <Tag
                          color="green"
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            display: "flex",
                            gap: "5px",
                            padding: "0.25rem",
                          }}
                        >
                          {user.savedPosts?.includes(post._id) ? (
                            <HeartFilled
                              style={{ color: "red", fontSize: "1rem" }}
                              onClick={() => {
                                handleSave(post._id);
                                message.success("Removed saved!");
                              }}
                            />
                          ) : (
                            <HeartOutlined
                              style={{ fontSize: "1rem" }}
                              onClick={() => {
                                handleSave(post._id);
                                message.success("Post saved!");
                              }}
                            />
                          )}
                          {user.reportedPosts?.includes(post._id) ? (
                            <WarningFilled
                              style={{ fontSize: "1rem" }}
                              onClick={() => {
                                handleReport(post._id);
                                message.info("Post Report Removed!");
                              }}
                            />
                          ) : (
                            <WarningOutlined
                              style={{ fontSize: "1rem" }}
                              onClick={() => {
                                handleReport(post._id);
                                message.info("Post Reported!");
                              }}
                            />
                          )}
                        </Tag>
                      </div>
                    }
                  >
                    <Title
                      level={4}
                      style={{
                        color: "#333",
                        fontWeight: 600,
                        fontSize: "1.1em",
                        lineHeight: "1.4",
                      }}
                    >
                      {truncateText(post.data.title || post.data.text, 120)}
                    </Title>
                    <Text style={{ color: "#888" }}>{post.data.author}</Text>

                    <div
                      style={{
                        marginTop: "10px",
                        textAlign: "right",
                      }}
                    >
                      {currentSource === "reddit" && (
                        <a
                          href={`https://www.reddit.com${post.data.permalink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1890ff",
                            textDecoration: "none",
                            fontSize: "1.2em",
                          }}
                        >
                          <LinkOutlined />
                        </a>
                      )}
                      {currentSource === "twitter" && (
                        <a
                          href={`https://twitter.com/${post.data.author}/status/${post.data.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#1890ff",
                            textDecoration: "none",
                            fontSize: "1.2em",
                          }}
                        >
                          <LinkOutlined />
                        </a>
                      )}
                    </div>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          <Pagination
            current={page}
            total={totalPosts}
            pageSize={limit}
            onChange={handlePaginationChange}
            showSizeChanger
            pageSizeOptions={["10", "20", "30"]}
            onShowSizeChange={(current, size) => setLimit(size)}
            style={{ textAlign: "center", marginTop: "20px" }}
          />
        </>
      )}
    </div>
  );
};

export default Feed;
