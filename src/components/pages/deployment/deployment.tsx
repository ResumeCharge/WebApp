import React, { useEffect, useState } from "react";
import Header from "../../navigation/header/header";
import Footer from "../../navigation/footer/footer";
import ChooseTemplate from "./components/chooseTemplate/chooseTemplate";
import DeploymentOptions from "./components/deploymentOptions/deploymentOptions";
import { ITemplate } from "../account/templates/templateItems";
import "./deployment.scss";
import { deployWebsite } from "../../../microservices/deployment-service/deploymentService.api";
import { IDeployment } from "../../../microservices/deployment-service/models/deployment.model";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { getUser } from "../../../store/reducers/userSlice";
import { getAvailableTemplates } from "../../../utilities/templates/templateHelper";
import DeploymentProvider from "./components/deploymentProvider/deploymentProvider";
import { getResumeDetails } from "../../../store/reducers/resumeDetailsSlice";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { USER_ID } from "../../../app.constants";

export interface IHandleDeployWebsite {
  title: string;
  description: string;
  extraConfigurationOptions?: Map<string, any>;
  profilePicture?: string;
  resumeDocument?: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Deployment() {
  const [showDeploymentProviderComponent, setShowDeploymentProviderComponent] =
    useState(true);
  const [showChooseTemplateComponent, setShowChooseTemplateComponent] =
    useState(false);
  const [
    showWebsiteDeploymentOptionsComponent,
    setShowWebsiteDeploymentOptionsComponent,
  ] = useState(false);
  const [templates, setTemplates] = useState<Array<ITemplate>>([]);
  const [template, setTemplate] = useState<ITemplate | null>(null);
  const [deploymentProvider, setDeploymentProvider] = useState<string | null>(
    null
  );
  const [hasError, setHasError] = useState(false);
  const resumeDetails = useAppSelector(getResumeDetails);
  const user = useAppSelector(getUser);
  const navigate = useNavigate();

  useEffect(() => {
    const getTemplates = async () => {
      const templates = await getAvailableTemplates();
      setTemplates(templates);
    };
    getTemplates();
    if (
      !resumeDetails._id ||
      !resumeDetails.nickname ||
      !resumeDetails.completed
    ) {
      setHasError(true);
    }
  }, [user.userId]);

  const handleErrorDialogClose = () => {
    navigate("/account");
  };

  const handleChooseTemplateComplete = (template: ITemplate) => {
    setShowChooseTemplateComponent(false);
    setShowWebsiteDeploymentOptionsComponent(true);
    setTemplate(template);
  };

  const handleChooseDeploymentProviderComplete = (
    deploymentProvider: string
  ) => {
    setShowDeploymentProviderComponent(false);
    setShowChooseTemplateComponent(true);
    setDeploymentProvider(deploymentProvider);
  };

  const handleChooseTemplateOnBack = () => {
    setShowChooseTemplateComponent(false);
    setShowDeploymentProviderComponent(true);
  };

  const handleDeploymentOptionsOnBack = () => {
    setShowChooseTemplateComponent(true);
    setShowWebsiteDeploymentOptionsComponent(false);
  };

  const handleDeployWebsite = async (
    deploymentOptions: IHandleDeployWebsite
  ) => {
    try {
      if (!template || !resumeDetails._id) {
        console.error("No resume or templateId found");
        return;
      }
      if (!deploymentProvider) {
        console.error("Deployment provider missing");
        return;
      }

      const deployment: IDeployment = {
        userId: USER_ID,
        resumeId: resumeDetails._id,
        templateId: template.key,
        deploymentProvider: deploymentProvider,
        websiteDetails: {
          title: deploymentOptions.title,
          description: deploymentOptions.description,
          profilePicture: deploymentOptions.profilePicture,
          resumeDocument: deploymentOptions.resumeDocument,
        },
      };

      try {
        await deployWebsite(deployment);
        navigate("/account");
      } catch (err) {
        let alertMessage = "Unable to create website, please try again later";
        if (err instanceof Error) {
          if (err.message.startsWith("DEPLOYMENT_ERROR_4")) {
            alertMessage =
              "Another website is already being created, wait until the website is done creating or cancel before creating a new website";
          }
        }
        alert(alertMessage);
      }
    } catch (e) {}
  };

  /*I don't like this auth*/
  return (
    <div className={"deployment_container"}>
      <Header />
      <div className={"deployment_container_main_content"}>
        <Dialog
          open={hasError}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleErrorDialogClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Resume Error"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              There was an issue retrieving the resume you selected, please
              return to the previous page and try again. If this error persists,
              please use the Contact Us form to send us a message and report the
              issue.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleErrorDialogClose}>Ok</Button>
          </DialogActions>
        </Dialog>
        <div className={"choose_deployment_provider_container"}>
          {showDeploymentProviderComponent ? (
            <DeploymentProvider
              onComplete={handleChooseDeploymentProviderComplete}
            />
          ) : null}
        </div>
        <div className={"chose_template_container"}>
          {showChooseTemplateComponent ? (
            <ChooseTemplate
              onComplete={handleChooseTemplateComplete}
              userId={USER_ID}
              templates={templates}
              onBack={handleChooseTemplateOnBack}
            />
          ) : null}
        </div>
        <div className={"deploy_website_options_container"}>
          {showWebsiteDeploymentOptionsComponent && template ? (
            <DeploymentOptions
              onBack={handleDeploymentOptionsOnBack}
              template={template}
              onComplete={handleDeployWebsite}
              deploymentProvider={deploymentProvider}
            />
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
}
