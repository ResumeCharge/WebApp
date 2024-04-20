import React, { useState } from "react";
import "./signIn.scss";
import {
  signInUserWithGoogle,
  signInWithUserEmailAndPassword,
} from "../../../../utilities/auth/googleAuthHelper";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

interface IProps {
  onSuccess?(): void;

  onFailure?(): void;
}

function SignInCard(props: IProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasEmailError, setHasEmailError] = useState(false);
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [accountDoesNotExist, setAccountDoesNotExist] = useState(false);
  const email = React.useRef<HTMLInputElement>(null);
  const password = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleEmailPasswordKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      signInUser();
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const success = await signInUserWithGoogle();
    if (!success) {
      setIsLoading(false);
      alert("sign in failed");
      return;
    }
    if (props.onSuccess) {
      setIsLoading(false);
      props.onSuccess();
    }
  };

  const signInUser = async () => {
    const emailValue = email?.current?.value;
    const passwordValue = password?.current?.value;
    !emailValue ? setHasEmailError(true) : setHasEmailError(false);
    !passwordValue ? setHasPasswordError(true) : setHasPasswordError(false);
    if (emailValue && passwordValue) {
      setIsLoading(true);
      const isSignInSuccessful = await signInWithUserEmailAndPassword(
        emailValue,
        passwordValue
      );

      if (isSignInSuccessful) {
        if (props.onSuccess) {
          props.onSuccess();
        }
        setIsLoading(false);
      } else {
        alert("sign in failed");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className={"signin_card"}>
      <div className={"signin_title"}>
        <h1>ResumeCharge</h1>
        <p>From resume to website in minutes</p>
      </div>
      <div>
        <button className="gsi-material-button" onClick={signInWithGoogle}>
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                style={{ display: "block" }}
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">
              Sign in with Google
            </span>
            <span style={{ display: "none" }}>Sign in with Google</span>
          </div>
        </button>
      </div>
      <div className={"sign_in_or"}>
        <span className={"sign_in_or_span"}>OR</span>
      </div>
      <div className={"signin_email signin_field"}>
        <label htmlFor={"email"}>Email</label>
        <input
          ref={email}
          type={"email"}
          id={"email"}
          placeholder={"Email"}
          onKeyDown={(e) => handleEmailPasswordKeyPress(e)}
        />
        {hasEmailError ? <p>Required</p> : null}
      </div>
      <div className={"signin_password signin_field"}>
        <label htmlFor={"password"}>Password</label>
        <input
          ref={password}
          type={"password"}
          id={"password"}
          placeholder={"Password"}
          onKeyDown={(e) => handleEmailPasswordKeyPress(e)}
        />
        {hasPasswordError ? <p>Required</p> : null}
      </div>
      <div className={"signin_button_container"}>
        {accountDoesNotExist ? (
          <p>No account with that email and password exists</p>
        ) : null}
        <button
          className={`signin_button ${isLoading ? "disabled" : null}`}
          onClick={signInUser}
        >
          {isLoading ? <LoadingOutlined /> : "Sign In"}
        </button>
      </div>
      <p
        onClick={() => navigate("/forgotPassword")}
        className={"forgot_password"}
      >
        Forgot Password?
      </p>
      <div className={"signup_container"}>
        <p>Don't have an account?</p>
        <p className={"sign_up_action"} onClick={() => navigate("/signup")}>
          Sign up
        </p>
      </div>
    </div>
  );
}

export default SignInCard;
