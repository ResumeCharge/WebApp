import Header from "../../../navigation/header/header";
import Footer from "../../../navigation/footer/footer";
import "./forgotPassword.scss";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [hasError, setHasError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const auth = getAuth();
  const SUCCESS_MESSAGE =
    "Success. An email will be sent to this email if an account is registered under it.";
  const EMAIL_NOT_FOUND_MESSAGE = "Firebase: Error (auth/user-not-found).";
  const USER_VISIBLE_ERROR_MESSAGE = "Invalid email provided";
  const handlePasswordReset = () => {
    setHasError(false);
    setIsSuccessful(false);
    if (email === "") {
      handleHasError(USER_VISIBLE_ERROR_MESSAGE);
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsSuccessful(true);
        setEmail("");
      })
      .catch((err: FirebaseError) => {
        if (err.message === EMAIL_NOT_FOUND_MESSAGE) {
          setIsSuccessful(true);
        } else {
          handleHasError(USER_VISIBLE_ERROR_MESSAGE);
        }
      });
  };

  const handleHasError = (errMessage: string) => {
    setHasError(true);
    setHasError(true);
    setErrMessage(errMessage);
  };

  return (
    <div>
      <Header />
      <div className={"reset_password_container"}>
        <div className={"reset_password_card"}>
          <h1 className={"reset_password_title"}>Reset Password</h1>
          <div className={"reset_password_field"}>
            <label htmlFor={"reset-password"}>Email</label>
            <input
              type={"email"}
              id={"reset-password"}
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
          </div>
          <button onClick={handlePasswordReset}>Reset Password</button>
          {hasError ? (
            <p className={"reset_password_error"}>{errMessage}</p>
          ) : null}
          {isSuccessful ? <p>{SUCCESS_MESSAGE}</p> : null}
        </div>
      </div>

      <Footer />
    </div>
  );
};
