import "./accountsDetails.scss";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import React, { useState } from "react";
import { validatePasswordRegex } from "../../../users/constants";
import { signOut } from "../../../../../utilities/auth/googleAuthHelper";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { getUser, resetUser } from "../../../../../store/reducers/userSlice";
import { useNavigate } from "react-router-dom";
import { getAccountManagementPortalSession } from "../../../../../utilities/stripe/stripeHelper";

export const AccountDetails = () => {
  const currentPassword = React.useRef<HTMLInputElement>(null);
  const newPassword = React.useRef<HTMLInputElement>(null);
  const confirmPassword = React.useRef<HTMLInputElement>(null);
  const [missingCurrentPasswordError, setMissingCurrentPassword] =
    useState(false);
  const [invalidCurrentPasswordError, setInvalidCurrentPasswordError] =
    useState(false);
  const [missingNewPasswordError, setMissingNewPasswordError] = useState(false);
  const [missingConfirmPasswordError, setMissingConfirmPasswordError] =
    useState(false);
  const [passwordsDontMatchError, setPasswordsDontMatchError] = useState(false);
  const [
    passwordDoesntMeetRequirementsError,
    setPasswordDoesntMeetRequirementsError,
  ] = useState(false);
  const [isPasswordResetSuccessful, setIsPasswordResetSuccessful] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBillingPortal, setIsLoadingBillingPortal] = useState(false);
  const auth = getAuth();
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const navigate = useNavigate();

  const handleUpdatePassword = async () => {
    setIsPasswordResetSuccessful(false);
    const isValid = await isValidResetPasswordInput();
    if (!isValid) {
      return;
    } else {
      try {
        const updatePasswordResult = await updatePassword(
          // @ts-ignore
          auth.currentUser,
          // @ts-ignore
          newPassword.current.value
        );
        handlePasswordResetSuccess();
      } catch (err: any) {}
    }
  };

  const handlePasswordResetSuccess = () => {
    resetPasswordErrors();
    setIsPasswordResetSuccessful(true);
    // @ts-ignore
    currentPassword.current.value = "";
    // @ts-ignore
    newPassword.current.value = "";
    // @ts-ignore
    confirmPassword.current.value = "";
  };

  const isValidResetPasswordInput = async (): Promise<boolean> => {
    resetPasswordErrors();
    if (!auth.currentUser) {
      await signOut();
      dispatch(resetUser());
      navigate("/");
      return false;
    }
    if (!currentPassword?.current?.value) {
      setMissingCurrentPassword(true);
      return false;
    }

    if (!newPassword?.current?.value) {
      setMissingNewPasswordError(true);
      return false;
    }

    if (!confirmPassword?.current?.value) {
      setMissingConfirmPasswordError(true);
      return false;
    }
    // @ts-ignore
    if (!(newPassword.current.value === confirmPassword.current.value)) {
      setPasswordsDontMatchError(true);
      return false;
    }
    // @ts-ignore
    if (!validatePasswordRegex.test(newPassword.current.value)) {
      setPasswordDoesntMeetRequirementsError(true);
      return false;
    }

    const isCurrentPasswordValid = await isUserPasswordValid(
      // @ts-ignore
      auth.currentUser.email,
      // @ts-ignore
      currentPassword.current.value
    );
    if (!isCurrentPasswordValid) {
      setInvalidCurrentPasswordError(true);
      return false;
    }
    return true;
  };

  const resetPasswordErrors = () => {
    setMissingCurrentPassword(false);
    setInvalidCurrentPasswordError(false);
    setMissingConfirmPasswordError(false);
    setMissingNewPasswordError(false);
    setPasswordDoesntMeetRequirementsError(false);
    setPasswordsDontMatchError(false);
  };

  const isUserPasswordValid = async (email: string, password: string) => {
    if (!auth.currentUser) {
      throw new Error("User not valid");
    }
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);

      return true;
    } catch (err) {
      return false;
    }
  };

  const handleManageSubscriptionRequest = async () => {
    setIsLoadingBillingPortal(true);
    if (user) {
      const url = await getAccountManagementPortalSession();
      if (url) {
        window.location.href = url;
      } else {
        alert("Error retrieving invoices, please try again later");
        setIsLoadingBillingPortal(false);
      }
    }
  };

  const getPasswordResultMessages = () => {
    return (
      <div className={"password_reset_result_messages"}>
        {passwordDoesntMeetRequirementsError ? (
          <p>
            Error: Password must be at least 8 characters long, contain one
            number and one special character ["@$!%*#?&"]
          </p>
        ) : null}
        {missingCurrentPasswordError ? (
          <p>Error: Current password field must not be empty</p>
        ) : null}
        {invalidCurrentPasswordError ? (
          <p>
            Error: Unable to change password, double check your current password
            or try again later
          </p>
        ) : null}
        {missingNewPasswordError ? <p>New password cannot be empty</p> : null}
        {missingConfirmPasswordError ? (
          <p>Error: Confirm new password cannot be empty</p>
        ) : null}
        {passwordsDontMatchError ? (
          <p>Error: New passwords don't match</p>
        ) : null}
        {isPasswordResetSuccessful ? (
          <p>Password changed successfully!</p>
        ) : null}
      </div>
    );
  };

  return (
    <div className={"account_details_main_content"}>
      <h1 className={"account_details_login_info"}>Login Details</h1>
      <div className={"account_details_email"}>
        <h1>Email: {user.email}</h1>
      </div>
      <div className={"account_details_password"}>
        <h1>Password: *******</h1>
      </div>
      <div className={"account_details_change_password account_details_fields"}>
        <h1>Change Password</h1>
        <div className={"account_details_password_input_field"}>
          <label htmlFor={"current-password"}>Current Password</label>
          <input
            type={"password"}
            id={"current-password"}
            ref={currentPassword}
          />
        </div>
        <div className={"account_details_password_input_field"}>
          <label htmlFor={"new-password"}>New Password</label>
          <input type={"password"} id={"new-password"} ref={newPassword} />
        </div>
        <div className={"account_details_password_input_field"}>
          <label htmlFor={"new-password-confirm"}>Confirm New Password</label>
          <input
            type={"password"}
            ref={confirmPassword}
            id={"new-password-confirm"}
          />
        </div>
        {getPasswordResultMessages()}
        <button onClick={handleUpdatePassword}>Update Password</button>
      </div>
    </div>
  );
};
