import "./deploymentProvider.scss";
import DeploymentProviderCard from "./deploymentProviderCard";
import GitHubCat from "../../../../../assets/images/common/github-cat.svg";
import React, { useState } from "react";
import DeploymentProviderNullDialog from "../../UI/deploymentProviderNullDialog";
import { hasValidGithubToken } from "../../../../../microservices/user-service/userService.api";
import DeploymentProviderConnectToGithubDialog from "../../UI/deploymentProviderConnectToGithubDialog";

interface IProps {
  onComplete(deploymentProvider: string): void;
}

export default function DeploymentProvider(props: IProps) {
  const [showWebsiteIdentifierDialog, setShowWebsiteIdentifierDialog] =
    useState(false);
  const [showGithubTokenDialog, setShowGithubTokenDialog] = useState(false);

  const onNext = async (provider: string) => {
    if (provider === "github") {
      const hasValidToken = await hasValidGithubToken();
      if (!hasValidToken) {
        setShowGithubTokenDialog(true);
        return;
      }
    }
    if (props.onComplete && provider) {
      props.onComplete(provider);
    }
  };

  return (
    <div className={"deployment_provider_container"}>
      {showWebsiteIdentifierDialog ? (
        <DeploymentProviderNullDialog
          open={showWebsiteIdentifierDialog}
          onClose={() => setShowWebsiteIdentifierDialog(false)}
        />
      ) : null}
      {showGithubTokenDialog ? (
        <DeploymentProviderConnectToGithubDialog
          open={showGithubTokenDialog}
          onClose={() => setShowGithubTokenDialog(false)}
        />
      ) : null}
      <h1 className={"deployment_provider_title"}>
        Choose how to host your website
      </h1>
      <div className={"deployment_provider_cards"}>
        <DeploymentProviderCard
          title={"GitHub"}
          image={GitHubCat}
          onClick={() => onNext("github")}
        />
      </div>
    </div>
  );
}
