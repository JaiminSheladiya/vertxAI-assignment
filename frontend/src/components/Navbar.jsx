import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
      <Menu.Item key="1">
        <Link to="/login">Login</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/register">Register</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
