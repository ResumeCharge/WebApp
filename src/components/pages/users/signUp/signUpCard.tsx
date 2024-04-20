import React, { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { signUp } from "../../../../utilities/auth/googleAuthHelper";
import "./signUp.scss";
import { validatePasswordRegex } from "../constants";

interface IProps {
  onSuccess?(): void;
  onFailure?(): void;
}

export const SignUpCard = (props: IProps) => {
  const EMAIL_IN_USE_ERROR = "auth/email-already-in-use";
  const EMAIL_IN_USE_ERROR_MESSAGE = "email already in use.";

  const [isLoading, setIsLoading] = useState(false);
  const [missingEmailError, setMissingEmailError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [missingPasswordError, setMissingPasswordError] = useState(false);
  const [missingConfirmPasswordError, setMissingConfirmPasswordError] =
    useState(false);
  const [passwordsDontMatchError, setPasswordsDontMatchError] = useState(false);
  const [
    passwordDoesntMeetRequirementsError,
    setPasswordDoesntMeetRequirementsError,
  ] = useState(false);
  const [hasSignupError, setHasSignupError] = useState(false);
  const [signupErrorMessage, setSignupErrorMessage] = useState(
    "Error completing signup. Please try again."
  );
  const email = React.useRef<HTMLInputElement>(null);
  const password = React.useRef<HTMLInputElement>(null);
  const confirmPassword = React.useRef<HTMLInputElement>(null);

  const signUpNewUser = async () => {
    const emailRegex = new RegExp(".+@.+\\..+");
    const passwordValue = password?.current?.value;
    const emailValue = email?.current?.value;
    setHasSignupError(false);
    setSignupErrorMessage("");
    setEmailFormatError(false);
    setMissingEmailError(!emailValue);

    const isValidPassword = checkAndSetPasswordErrors();
    if (!isValidPassword) {
      return;
    }

    if (emailValue && !emailRegex.test(emailValue)) {
      setEmailFormatError(true);
      return;
    }
    if (emailValue) {
      setIsLoading(true);
      // @ts-ignore
      const signUpResponse = await signUp(emailValue, passwordValue);
      if (signUpResponse.successful) {
        if (props.onSuccess) {
          props.onSuccess();
        }
      } else {
        setHasSignupError(true);
        const errorMessage = signUpResponse.errorMessage;
        if (errorMessage instanceof Error) {
          if (errorMessage.message.includes(EMAIL_IN_USE_ERROR)) {
            setSignupErrorMessage(
              "Unable to sign up, " + EMAIL_IN_USE_ERROR_MESSAGE
            );
          }
        } else {
          setSignupErrorMessage("Unable to sign up, please try again.");
        }
        alert(signupErrorMessage);
      }
    }
    setIsLoading(false);
  };

  const checkAndSetPasswordErrors = (): boolean => {
    setPasswordDoesntMeetRequirementsError(false);
    setPasswordsDontMatchError(false);

    const passwordValue = password?.current?.value;
    const confirmPasswordValue = confirmPassword?.current?.value;

    setMissingPasswordError(!passwordValue);
    setMissingConfirmPasswordError(!confirmPasswordValue);

    if (
      passwordValue &&
      confirmPasswordValue &&
      passwordValue !== confirmPasswordValue
    ) {
      setPasswordsDontMatchError(true);
      return false;
    }

    // @ts-ignore
    if (!validatePasswordRegex.test(passwordValue)) {
      setPasswordDoesntMeetRequirementsError(true);
      return false;
    }
    return true;
  };

  return (
    <div className={"signup_card"}>
      <div className={"signup_title"}>
        <h1>ResumeCharge</h1>
        <p>From resume to website in minutes</p>
      </div>
      <div className={"signup_email signup_field"}>
        <label htmlFor={"email"}>Email</label>
        <input ref={email} type={"email"} id={"email"} placeholder={"Email"} />
        {missingEmailError ? <p>Email field cannot be empty</p> : null}
        {emailFormatError ? (
          <p>Email format must be example@domain.com</p>
        ) : null}
      </div>
      <div className={"signup_password signup_field"}>
        <label htmlFor={"password"}>Password</label>
        <input
          ref={password}
          type={"password"}
          id={"password"}
          placeholder={"Password"}
          onBlur={checkAndSetPasswordErrors}
        />
        {passwordDoesntMeetRequirementsError ? (
          <p>
            Password must be at least 8 characters long, contain one number and
            one special character ["@$!%*#?&"]
          </p>
        ) : null}
        {missingPasswordError ? <p>Password field must not be empty</p> : null}
        {passwordsDontMatchError ? <p>Passwords don't match</p> : null}
      </div>
      <div className={"signup_confirm_password signup_field"}>
        <label htmlFor={"password"}>Confirm Password</label>
        <input
          ref={confirmPassword}
          type={"password"}
          id={"confirmPassword"}
          placeholder={"Confirm Password"}
          onBlur={checkAndSetPasswordErrors}
        />
        {missingConfirmPasswordError ? (
          <p>Confirm password field cannot be empty</p>
        ) : null}
      </div>
      <button className={"signup_button"} onClick={signUpNewUser}>
        {isLoading ? <LoadingOutlined /> : "Create Account"}
      </button>
    </div>
  );
};
