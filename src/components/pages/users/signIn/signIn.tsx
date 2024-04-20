import React from "react";
import Header from "../../../navigation/header/header";
import Footer from "../../../navigation/footer/footer";
import "./signIn.scss";
import { useLocation, useNavigate } from "react-router-dom";
import SignInCard from "./signInCard";

function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const signInUser = () => {
    const activeItem = location.state?.activeItem;
    if (activeItem) {
      navigate("/account");
    } else {
      navigate("/account");
    }
  };

  return (
    <div>
      <Header disableLogin={true} />
      <div className={"signin_container"}>
        <SignInCard onSuccess={() => signInUser()} />
      </div>
      <Footer />
    </div>
  );
}

export default SignIn;
