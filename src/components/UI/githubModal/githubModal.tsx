import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import "./githubModal.scss";
import { getGithubAuthEndpoint } from "../../../utilities/github/githubTokenHelper";

interface props {
  onCancel?(): void;
  onOk?(): void;
  showModal: boolean;
}

function GithubModal(props: props) {
  const [isLinkGithubAccountModalVisible, setIsLinkGithubAccountModalVisible] =
    useState(props.showModal);
  const [isRedirectToGithubModalVisible, setIsRedirectToGithubModalVisible] =
    useState(false);

  useEffect(() => {
    setIsLinkGithubAccountModalVisible(props.showModal);
  }, [isLinkGithubAccountModalVisible, props.showModal]);

  const handleCancel = () => {
    if (props.onCancel) {
      props.onCancel();
    }
    setIsLinkGithubAccountModalVisible(false);
    setIsRedirectToGithubModalVisible(false);
    if (props.onCancel) props.onCancel();
  };

  const handleConnectGithubOk = () => {
    setIsLinkGithubAccountModalVisible(false);
    setIsRedirectToGithubModalVisible(true);
  };

  const redirectToGithub = () => {
    const githubAuthEndpoint = getGithubAuthEndpoint();
    window.location.href = githubAuthEndpoint;
  };

  return (
    <div className={"github_container"}>
      <Modal
        title="Link Github Account"
        open={isLinkGithubAccountModalVisible}
        onOk={handleConnectGithubOk}
        onCancel={handleCancel}
        cancelText={"Not right now"}
        okText={"Connect Github Account"}
        cancelButtonProps={{ danger: true }}
      >
        <p>
          To create your own custom portfolio you will need to link your Github
          account
        </p>
      </Modal>
      <Modal
        title="Link Github Account"
        open={isRedirectToGithubModalVisible}
        onOk={redirectToGithub}
        onCancel={handleCancel}
        cancelText={"Cancel"}
        okText={"Go to Github"}
        okButtonProps={{ type: "primary" }}
        cancelButtonProps={{ danger: true }}
      >
        <div className={"redirect_github_modal"}>
          <h1>
            Click the "Go to Github" button to connect your Github account.
          </h1>
          <p>You will return to Resume Charge when finished</p>
        </div>
      </Modal>
    </div>
  );
}

export default GithubModal;
