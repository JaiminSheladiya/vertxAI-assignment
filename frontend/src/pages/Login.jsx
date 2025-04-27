import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  notification,
  message,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../redux/reducer/authReducer";
import { fetchUserInfo } from "../redux/actions/userActions";

const { Title, Text } = Typography;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  console.log("isLogin: ", isLogin);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMode = () => setIsLogin((prev) => !prev);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      style: {
        backgroundColor: type === "success" ? "#f6ffed" : "#fff2f0",
        borderLeft: `5px solid ${type === "success" ? "#52c41a" : "#ff4d4f"}`,
      },
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post("auth/login", values);
        console.log("res: ", res.data.token);
        dispatch(loginAction(res.data.token));
        dispatch(fetchUserInfo());
        openNotification("success", "Login Successful", "Welcome back!");
        navigate("/feed");
      } else {
        const res = await api.post("auth/register", values);
        dispatch(loginAction(res.data.token));
        openNotification("success", "Account Created", "You can now login");
        setIsLogin(true);
      }
    } catch (err) {
      openNotification(
        "error",
        "Something went wrong",
        err.response?.data?.message || "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: 400,
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          borderRadius: "12px",
          background: "#fff",
          textAlign: "center",
        }}
      >
        <Title level={2}>{isLogin ? "Welcome Back" : "Create Account"}</Title>
        <Text type="secondary">
          {isLogin ? "Login to continue" : "Sign up to get started"}
        </Text>
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: "20px" }}
        >
          {!isLogin && (
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Enter your username" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
              />
            </Form.Item>
          )}
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Enter your email" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
              style={{
                fontWeight: "bold",
              }}
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </Form.Item>
        </Form>
        <Button
          type="link"
          icon={<SwapOutlined />}
          onClick={toggleMode}
          style={{ marginTop: "10px" }}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Button>
      </Card>
    </div>
  );
};

export default AuthPage;
