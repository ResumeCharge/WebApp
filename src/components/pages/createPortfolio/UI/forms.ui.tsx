import React from "react";
import "./forms.ui.scss";

interface INextAndBackProps {
  backDisabled?: boolean;
  back?(): void;
  onSubmitDisabled?: boolean;
  onContinueClick?(): void;
}

export const NextAndBackButtons = (props: INextAndBackProps) => {
  const handleContinueClick = () => {
    if (props.onContinueClick) {
      props.onContinueClick();
    }
  };

  return (
    <div className={"forms_ui_next_back_buttons"}>
      {props.backDisabled ? null : (
        <button
          type={"button"}
          className={"forms_ui_next_back_buttons_back"}
          onClick={() => {
            if (props.back) props.back();
          }}
        >
          Back
        </button>
      )}

      <button
        type={props.onSubmitDisabled ? "button" : "submit"}
        className={"forms_ui_next_back_buttons_next_next"}
        onClick={() => handleContinueClick()}
      >
        Continue
      </button>
    </div>
  );
};
