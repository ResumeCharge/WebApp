import "./accountsDetails.scss";
import React, { useState } from "react";
import { updateUser } from "../../../../../microservices/user-service/userService.api";

export const AccountDetails = () => {
  const [missingGitHubToken, setMissingGitHubToken] = useState(false);
  const [isGitHubTokenUpdateSuccessful, setIsGitHubTokenUpdateSuccessful] =
    useState(false);
  const gitHubToken = React.useRef<HTMLInputElement>(null);
  const isValidGitHubTokenUpdateRequest = async (): Promise<boolean> => {
    setMissingGitHubToken(false);
    if (!gitHubToken?.current?.value) {
      setMissingGitHubToken(true);
      return false;
    }
    return true;
  };
  const getGitHubTokenResultMessages = () => {
    return (
      <div className={"github_token_update_result_messages"}>
        {isGitHubTokenUpdateSuccessful ? (
          <p>GitHub Token changed successfully!</p>
        ) : null}
      </div>
    );
  };
  const handleGitHubTokenUpdate = async () => {
    setIsGitHubTokenUpdateSuccessful(false);
    const isValid = await isValidGitHubTokenUpdateRequest();
    if (!isValid) {
      return;
    }
    try {
      await updateUser({ githubToken: gitHubToken.current!.value });
      setIsGitHubTokenUpdateSuccessful(true);
      gitHubToken.current!.value = "";
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <div className={"account_details_main_content"}>
      <h1 className={"account_details_login_info"}>GitHub Token</h1>
      <div
        className={"account_details_change_github_token account_details_fields"}
      >
        <h1>Update GitHub Token</h1>
        <div className={"account_details_github_token_input_field"}>
          <label htmlFor={"update-github-token"}>GitHub Token</label>
          <input
            type={"password"}
            id={"update-github-token"}
            ref={gitHubToken}
          />
        </div>
        {getGitHubTokenResultMessages()}
        <button onClick={handleGitHubTokenUpdate}>Update GitHub Token</button>
      </div>
    </div>
  );
};
