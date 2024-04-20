import React, { useEffect, useState } from "react";
import { ITemplate } from "../../../account/templates/templateItems";
import happy from "../../../../../assets/images/deploy/happy.svg";
import ideas from "../../../../../assets/images/deploy/ideas.svg";
import { IHandleDeployWebsite } from "../../deployment";
import { convertToBase64 } from "../../../../../utilities/fileConverterHelper";
import * as Yup from "yup";
import { useAppSelector } from "../../../../../store/hooks";
import { getResumeDetails } from "../../../../../store/reducers/resumeDetailsSlice";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

interface IProps {
  template: ITemplate;
  onBack(): void;
  onComplete(deploymentOptions: IHandleDeployWebsite): Promise<void>;
  deploymentProvider: string | null;
}

export default function DeploymentOptions(props: IProps) {
  const [title, setTitle] = useState<string>("");
  const [websiteTitleError, setWebsiteTitleError] = useState<
    string | undefined
  >(undefined);
  const [description, setDescription] = useState<string>("");
  const [websiteDescriptionError, setWebsiteDescriptionError] = useState<
    string | undefined
  >(undefined);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    undefined
  );
  const [profilePictureFile, setProfilePictureFile] = useState<
    File | undefined
  >(undefined);
  const [resumeDocument, setResumeDocument] = useState<File | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const resumeDetails = useAppSelector(getResumeDetails);
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.deploymentProvider) {
      alert("Hosting provider missing, please retry deployment again");
      navigate("/account");
    }
  }, []);

  const websiteTitleSchema = Yup.object({
    value: Yup.string()
      .max(50, "Website Title must be 50 characters or less")
      .required("Required"),
  });

  const websiteDescriptionSchema = Yup.object({
    value: Yup.string()
      .max(200, "Website description must be 200 characters or less")
      .required("Required"),
  });
  const handleOnComplete = async () => {
    setIsLoading(true);
    let websiteTitleError;
    let websiteDescriptionError;
    try {
      websiteTitleSchema.validateSync({
        value: title,
      });
    } catch (err) {
      if (err instanceof Error) {
        websiteTitleError = err.message;
      }
    }
    try {
      websiteDescriptionSchema.validateSync({
        value: description,
      });
    } catch (err) {
      if (err instanceof Error) {
        websiteDescriptionError = err.message;
      }
    }
    if (websiteTitleError || websiteDescriptionError) {
      setWebsiteTitleError(websiteTitleError);
      setWebsiteDescriptionError(websiteDescriptionError);
      setIsLoading(false);
      return;
    }
    setWebsiteTitleError(undefined);
    setWebsiteDescriptionError(undefined);
    let profilePictureBase64Encoded = "";
    let resumeDocumentBase64Encoded = "";

    if (profilePictureFile) {
      const result = await convertToBase64(profilePictureFile);
      if (typeof result === "string") {
        profilePictureBase64Encoded = result;
      }
    }

    if (resumeDocument) {
      const result = await convertToBase64(resumeDocument);
      if (typeof result === "string") {
        resumeDocumentBase64Encoded = result;
      }
    }

    const deployment: IHandleDeployWebsite = {
      title,
      description,
    };
    if (profilePictureBase64Encoded !== "") {
      deployment.profilePicture = profilePictureBase64Encoded;
    }
    if (resumeDocumentBase64Encoded !== "") {
      deployment.resumeDocument = resumeDocumentBase64Encoded;
    }
    await props.onComplete(deployment);
    setIsLoading(false);
  };

  const handleProfilePictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const url = URL.createObjectURL(event.target.files[0]);
      setProfilePictureFile(event.target.files[0]);
      setProfilePicture(url);
    }
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResumeDocument(event.target.files[0]);
    }
  };

  return (
    <div className={"deployments_container"}>
      <div className={"deployments_content"}>
        <div className={"deployments_title"}>
          <h1>Deploy your website</h1>
          <p>Your awesome website is just a flew clicks away</p>
          <Button
            color={"secondary"}
            variant={"contained"}
            onClick={props.onBack}
            className={"deployment_back_button"}
          >
            Back
          </Button>
        </div>
        <div className={"deployments_content_container"}>
          <div className={"deployments_content_side"}>
            <img src={happy} alt={"happy dancing"} className={"image_happy"} />
            <img src={ideas} alt={"ideas"} className={"image_ideas"} />
          </div>
          <div className={"deployments_form"}>
            <div className={"deployments_resume"}>
              <div className={"deployments_resume_title"}>
                <h1>Resume</h1>
              </div>
              <div className={"deployments_resume_item"}>
                <h1>{resumeDetails.nickname}</h1>
              </div>
            </div>
            <div className={"deployments_template"}>
              <div className={"deployments_template_title"}>
                <h1>Template</h1>
              </div>
              <div className={"deployments_template_item"}>
                <h1>{props.template.name}</h1>
              </div>
            </div>
            <div className={"deployments_provider"}>
              <div className={"deployments_provider_title"}>
                <h1>Hosted With</h1>
              </div>
              <div className={"deployments_provider_item"}>
                <h1>
                  {props.deploymentProvider === "aws"
                    ? "ResumeCharge"
                    : "GitHub"}
                </h1>
              </div>
            </div>
            <div className={"deployments_extra_options"}>
              <div className={"deployments_extra_options_items"}>
                <div className={"deployments_extra_options_container"}>
                  <label htmlFor={"deployments_title_label"}>
                    Website Title (required)
                  </label>
                  <input
                    id={"deployments_title_label"}
                    placeholder={"My Website"}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {websiteTitleError ? <p>{websiteTitleError}</p> : null}
                </div>
                <div className={"deployments_extra_options_container"}>
                  <label htmlFor={"deployments_website_description"}>
                    Website Description (required)
                  </label>
                  <input
                    id={"deployments_website_description"}
                    placeholder={"My awesome website"}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {websiteDescriptionError ? (
                    <p>{websiteDescriptionError}</p>
                  ) : null}
                </div>
                <div
                  className={
                    "deployments_extra_options_profile_picture deployments_upload_item_container"
                  }
                >
                  <h1>Profile Picture</h1>
                  {profilePicture ? (
                    <img alt={"Profile Picture Image"} src={profilePicture} />
                  ) : null}
                  <label htmlFor="avatar">Upload a profile picture:</label>
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/png, image/jpeg"
                    onChange={(event) => handleProfilePictureUpload(event)}
                  />
                </div>
                <div
                  className={
                    "deployments_extra_options_upload_resume deployments_upload_item_container"
                  }
                >
                  <h1>Upload Resume</h1>
                  <div className={"upload_resume_input"}>
                    <label htmlFor="avatar">Upload Resume (PDF or Word)</label>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".doc,.docx,.pdf"
                      title={"upload"}
                      onChange={(event) => handleResumeUpload(event)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleOnComplete}
              disabled={isLoading}
              className={`deployment_deploy_button ${
                isLoading ? "disabled" : ""
              }`}
            >
              {isLoading ? <Spin spinning={true} /> : "Create Website"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
