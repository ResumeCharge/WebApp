import React from "react";
import "./navBar.scss";

interface IProps {
  onBack?(): void;
  onNext?(): void;
  onDeploy?(): void;
  text?: string;
  showBackButton?: boolean;
  showDeployButton?: boolean;
  nextButtonDisabled?: boolean;
}

export default function NavBar(props: IProps) {
  const handleOnNext = () => {
    if (props.onNext) {
      props.onNext();
    }
  };

  const handleOnBack = () => {
    if (props.onBack) {
      props.onBack();
    }
  };

  const handleOnDeploy = () => {
    if (props.onDeploy) {
      props.onDeploy();
    }
  };

  return (
    <div className={"deploy_navbar_container"}>
      <div className={"deploy_navbar_back_button"}>
        {props.showBackButton ? (
          <button onClick={handleOnBack}>Back</button>
        ) : null}
      </div>
      <div className={"deploy_navbar_text"}>
        <p>{props.text}</p>
      </div>
      {!props.showDeployButton ? (
        <div
          className={`deploy_navbar_next_button${
            props.nextButtonDisabled ? " disabled" : ""
          }`}
        >
          <button disabled={props.nextButtonDisabled} onClick={handleOnNext}>
            Next
          </button>
        </div>
      ) : null}
      {props.showDeployButton ? (
        <div
          className={`deploy_navbar_next_button${
            props.nextButtonDisabled ? " disabled" : ""
          }`}
        >
          <button disabled={props.nextButtonDisabled} onClick={handleOnDeploy}>
            Deploy
          </button>
        </div>
      ) : null}
    </div>
  );
}
