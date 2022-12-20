import React, { useState } from "react";
import Logo from "../img/logo.png";
// displays a page header

export default function HeaderLeft() {
  return (
    <div style={{ marginRight: 30, padding: 20 }}>
      <img src={Logo} style={{ marginRight: 10, width: 40 }} />
      <span className="headerleft-title">We Do | </span>
      <span className="headerleft-slogan">We make it happen togetor</span>
    </div>
  );
}
