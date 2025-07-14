import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content d-flex justify-content-between">
        <h2 className="footer-title">Mini Blog</h2>

        <p className="footer-text">Group-4 Class: SE1816 Mentor: ThanhNG4</p>
        <div className="footer-qr">
          <img
            src="/images/zalo.jpg"
            alt="Zalo QR Code"
            className="footer-qr-img"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
