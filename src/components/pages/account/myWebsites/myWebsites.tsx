import React, { useCallback, useEffect, useState } from "react";
import {
  cancelDeployment,
  getDeploymentForUser,
  getDeploymentsForUser,
  IGetWebsitesForUserResponse,
} from "../../../../microservices/deployment-service/deploymentService.api";
import "./myWebsites.scss";
import { Progress, Spin } from "antd";
import RefreshIcon from "@mui/icons-material/Refresh";

interface IMyWebsitesProps {
  onGoToResumes(): void;
}

function MyWebsites(props: IMyWebsitesProps) {
  const [userWebsites, setUserWebsites] = useState<
    Array<IGetWebsitesForUserResponse>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshActive, setRefreshActive] = useState(false);
  const twoColors = { "0%": "#108ee9", "100%": "#87d068" };

  const getDeployments = useCallback(async () => {
    const deployments = await getDeploymentsForUser();
    if (deployments.length === 0) {
      setIsLoading(false);
      return deployments;
    }
    deployments.sort(
      (a: IGetWebsitesForUserResponse, b: IGetWebsitesForUserResponse) => {
        return b.createdAt - a.createdAt;
      }
    );
    setUserWebsites(deployments);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getDeployments();
  }, []);

  const handleCancelWebsiteRequest = async (deploymentId: string) => {
    await cancelDeployment(deploymentId);
    const deployments = await getDeployments();
    setUserWebsites(deployments);
  };

  const refreshDeployment = async (deploymentId: string) => {
    setRefreshActive(true);
    const deploymentFromDb = await getDeploymentForUser(deploymentId);
    const updatedDeployments = userWebsites.map((deployment) =>
      deployment._id === deploymentFromDb._id ? deploymentFromDb : deployment
    );
    setUserWebsites(updatedDeployments);
    setTimeout(() => {
      setRefreshActive(false);
    }, 500);
  };

  const getDeploymentCards = () => {
    return userWebsites.map((website, index) => {
      const date = new Date(website.createdAt);
      if (index === 0) {
        return getDeploymentCardForActiveWebsite(website);
      }
      return (
        <div className={"websites_item"}>
          <div className={"websites_item_details"}>
            <h1 className={"websites_item_title"}>
              {website.websiteDetails.title}
            </h1>
          </div>
          <div className={"websites_item_status"}>
            <h1>{`Created: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</h1>
          </div>
        </div>
      );
    });
  };

  const getDeploymentCardForActiveWebsite = (
    website: IGetWebsitesForUserResponse
  ) => {
    const status = website.status.toLowerCase();
    const isDeployed = status === "successful";
    const failed = status === "failed";
    const isDeploying = status === "processing";
    const isPending = status === "pending" || status === "pending_retry";
    const isExternalStatusChecks =
      status === "sent_to_aws" || status === "sent_to_github";
    const title = website.websiteDetails.title;
    const percentComplete = isDeployed ? 100 : website.progress;
    const progressStatus = failed ? "exception" : "active";
    const actionButton = getActionButton(website);
    const statusText = getStatusText(website);
    return (
      <div className={"websites_item"}>
        <div className={"websites_item_details"}>
          <h1 className={"websites_item_title"}>{title}</h1>
          {actionButton}
        </div>
        <div className={"websites_item_status"}>
          <div className={"websites_item_status_descriptor_and_refresh"}>
            <h1 className={"websites_item_title"}>{statusText}</h1>
            {isDeploying || isPending || isExternalStatusChecks ? (
              <RefreshIcon
                className={`websites_item_refresh_icon ${
                  refreshActive ? "refreshed" : ""
                }`}
                onClick={() => refreshDeployment(website._id)}
              />
            ) : null}
          </div>
          {isDeploying ? (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : null}
          {isDeployed ? (
            <Progress
              type="circle"
              percent={100}
              className={"website_status_progress_bar"}
            />
          ) : (
            <Progress
              percent={percentComplete}
              strokeColor={twoColors}
              status={progressStatus}
              className={"website_status_progress_bar"}
            />
          )}
        </div>
      </div>
    );
  };

  const getActionButton = (website: IGetWebsitesForUserResponse) => {
    const status = website.status.toLowerCase();
    const isDeployed = status === "successful";
    const isCancelled = status === "cancelled";
    const failed = status === "failed";
    const cancellationRequested = website.cancellationRequested;
    const link = website.deployedUrl;
    if (isCancelled) {
      return <p>Cancelled</p>;
    }
    if (isDeployed) {
      return (
        <button
          className={"websites_item_view"}
          onClick={() => {
            if (link.startsWith("https://")) {
              window.open(link, "_blank");
            } else {
              window.open(`https://${link}`, "_blank");
            }
          }}
        >
          View
        </button>
      );
    } else if (cancellationRequested && !failed) {
      return <p>Hang tight, we are trying to cancel the deployment</p>;
    } else if (!failed) {
      return (
        <button
          className={"websites_item_cancel"}
          onClick={() => handleCancelWebsiteRequest(website._id)}
        >
          Cancel
        </button>
      );
    }
    return null;
  };

  const getStatusText = (
    website: IGetWebsitesForUserResponse
  ): string | null => {
    const status = website.status.toLowerCase();
    const isDeployed = status === "successful";
    const isCancelled = status === "cancelled";
    const failed = status === "failed";
    const isDeploying = status === "processing";
    const isPending = status === "pending" || status === "pending_retry";
    const isExternalStatusChecks =
      status === "sent_to_aws" || status === "sent_to_github";
    const cancellationRequested = website.cancellationRequested;
    if (isCancelled) {
      return "Cancelled";
    } else if (cancellationRequested && !failed) {
      return "Cancellation Requested";
    } else if (isDeploying) {
      return "In-Progress";
    } else if (isPending) {
      return "Waiting to Start";
    } else if (isExternalStatusChecks) {
      return "Performing final updates";
    }
    return null;
  };

  return (
    <div>
      {isLoading ? (
        <Spin>Loading...</Spin>
      ) : (
        <div className={"websites_container_main"}>
          {userWebsites.length === 0 ? (
            <h1 className={"websites_no_deployments"}>
              You haven't created any websites yet.
            </h1>
          ) : (
            getDeploymentCards()
          )}
        </div>
      )}
    </div>
  );
}

export default MyWebsites;
