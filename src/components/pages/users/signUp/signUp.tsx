import React from "react";
import Header from "../../../navigation/header/header";
import Footer from "../../../navigation/footer/footer";
import "./signUp.scss";
import { SignUpCard } from "./signUpCard";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const handleSignUpSuccess = () => {
    navigate("/account", { state: { previousPage: "sign-up" } });
  };

  return (
    <div className={"sign-up-main-container"}>
      <Header disableLogin={true} />
      <div className={"signup_container"}>
        <SignUpCard onSuccess={handleSignUpSuccess} />
      </div>
      <Footer className={"sign-up-container-footer"} />
    </div>
  );
}

export default SignUp;
