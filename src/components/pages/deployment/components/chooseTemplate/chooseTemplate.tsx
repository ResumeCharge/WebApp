import React from "react";
import "./chooseTemplate.scss";
import { ITemplate } from "../../../account/templates/templateItems";
import { getAvailableTemplates } from "../../../../../utilities/templates/templateHelper";
import Button from "@mui/material/Button";
import TemplateCards from "../../../templates/templateCards";

interface IProps {
  onComplete(template: ITemplate): void;

  onBack(): void;

  userId: string;
  templates: Array<ITemplate>;
}

export default function ChooseTemplate(props: IProps) {
  const handleChooseTemplateAction = async (templateId: string) => {
    const templates = await getAvailableTemplates();
    const templateItem = templates.find(
      (templateItem) => templateItem.key === templateId
    );
    if (!templateItem) {
      alert("template not found!");
      return;
    }
    props.onComplete(templateItem);
  };
  console.log("TEMPLATES: " + JSON.stringify(props.templates));
  return (
    <div>
      <div className={"choose_template_main_heading"}>
        <h1>Choose a template to deploy your website</h1>
        <Button
          color={"secondary"}
          variant={"contained"}
          onClick={props.onBack}
          className={"deployment_back_button"}
        >
          Back
        </Button>
      </div>
      <div>
        <TemplateCards
          onDeploy={handleChooseTemplateAction}
          isDeploying={true}
        />
      </div>
    </div>
  );
}
