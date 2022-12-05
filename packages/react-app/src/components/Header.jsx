import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/" /*target="_blank" rel="noopener noreferrer"*/>
      <PageHeader
        title="Food Forest DAO"
        subTitle="让食物自由"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
