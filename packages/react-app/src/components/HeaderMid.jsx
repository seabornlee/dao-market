import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";

export default function HeaderMid() {
  const [route, setRoute] = useState("/");

  return (
    <div>
      <Menu
        style={{
          background: "rgba(29, 33, 41, 1)",
          borderBottom: "none",
          paddingTop: 9,
          color: "rgba(229, 230, 235, 1);",
        }}
        selectedKeys={[route]}
        mode="horizontal"
      >
        <Menu.Item key="/">
          <Link
            onClick={() => {
              setRoute("/");
            }}
            to="/"
          >
            Home
          </Link>
        </Menu.Item>
        <Menu.Item key="/solution">
          <Link
            onClick={() => {
              setRoute("/solution");
            }}
            to="/solution"
          >
            Solution
          </Link>
        </Menu.Item>
        <Menu.Item key="/myclub">
          <Link
            onClick={() => {
              setRoute("/myclub");
            }}
            to="/myclub"
          >
            My Club
          </Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}
