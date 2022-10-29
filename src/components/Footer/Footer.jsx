import React from "react";
import "./Footer.scss";
import { ReactComponent as Facebbok } from "../../assets/VIP-ICON-SVG/facebook.svg";
import { ReactComponent as Twitter } from "../../assets/VIP-ICON-SVG/twitter.svg";
import { ReactComponent as Instagram } from "../../assets/VIP-ICON-SVG/instagram.svg";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="info">
        <ul className="footer-ul">
          <li className="footer-li">About Us</li>
          <li className="footer-li">Terms</li>
          <li className="footer-li">Feedback</li>
          <li className="footer-li">FAQ</li>
        </ul>
        <ul className="footer-ul">
          <li className="footer-li">Follow Us On</li>
          <li className="social-icons">
            <Facebbok className="svg-icon" />
            <Twitter className="svg-icon" />
            <Instagram className="svg-icon" />
          </li>
        </ul>
        <ul className="footer-ul">
          <li className="footer-li">Contact Us</li>
          <li className="footer-li">Call Us</li>
          <li className="footer-li">Email Us</li>
        </ul>
      </div>

      <div className="copy-rigths">Copyright © 2022, VIP store</div>
    </footer>
  );
}
