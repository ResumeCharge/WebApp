import React, { useEffect, useState } from "react";
import "./firebase-auth.scss";
import { Spin } from "antd";
import logo from "../../../../assets/images/logo-no-name.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { applyActionCode, getAuth } from "firebase/auth";
import Alert from "@mui/material/Alert";

const OOB_CODE = "oobCode";

function FirebaseAuth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleEmailVerify = async () => {
      const oobCode = searchParams.get(OOB_CODE);
      if (!oobCode) {
        setHasError(true);
        setIsLoading(false);
        await new Promise((r) => setTimeout(r, 1000));
        navigate("/account");
        return;
      }
      try {
        const auth = getAuth();
        await applyActionCode(auth, oobCode);
      } catch (e) {
        setHasError(true);
      }
      setIsLoading(false);
      await new Promise((r) => setTimeout(r, 1000));
      navigate("/account");
    };
    handleEmailVerify();
  }, []);

  const getBodyContent = () => {
    if (hasError) {
      return (
        <Alert variant="filled" severity="error">
          Error verifying email, please try again.
        </Alert>
      );
    }
    if (isLoading) {
      return (
        <div className={"email_verify_loading"}>
          <div className={"logo_and_title_container"}>
            <img
              src={logo}
              alt={"Resume Charge logo"}
              className={"header_logo"}
            />
            <h1>ResumeCharge</h1>
          </div>
          <h1>Verifying Email</h1>
          <Spin spinning={true} className={"contact_us_spinner"} />
        </div>
      );
    }
    return (
      <div>
        <h1>Email Verified! You will be redirected shortly</h1>
        <h1>
          <a href={"/account"}>
            Click Here if you aren't automatically redirected
          </a>
        </h1>
      </div>
    );
  };

  return <div className={"firebase_auth_container"}>{getBodyContent()}</div>;
}

export default FirebaseAuth;
