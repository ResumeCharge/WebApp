import React from "react";
import "./footer.scss";
import { useNavigate } from "react-router-dom";

export const SIGNUP_KEY = "signup";

interface IProps {
  className?: string;
  elementOverrides?: Map<string, boolean>;
}

function Footer(props: IProps) {
  const navigate = useNavigate();
  return (
    <div
      className={`${props.className ? props.className : ""} footer-container`}
    >
      <div className={"footer-column"}>
        <h1>ResumeCharge</h1>
        <a onClick={() => navigate("/about")}>About</a>
        <a onClick={() => navigate("/faq")}>Frequently Asked Questions</a>
      </div>
      <div className={"footer-column"}>
        <h1>Features</h1>
        <a onClick={() => navigate("/templates")}>Templates</a>
      </div>
    </div>
  );
}

export default Footer;
