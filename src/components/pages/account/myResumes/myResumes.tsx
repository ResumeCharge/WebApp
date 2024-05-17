import React, { useEffect, useState } from "react";
import {
  deleteUserResume,
  getDeploymentsForUser,
  getResumesForUser,
  IGetResumesForUserResponse,
  IGetWebsitesForUserResponse,
  loadResumeIntoReduxStore,
} from "../../../../microservices/deployment-service/deploymentService.api";
import "./myResumes.scss";
import addResumeIcon from "../../../../assets/images/myresumes/add-resume-icon.svg";
import { getAuth, sendEmailVerification, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Alert } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
  CANCELLED,
  FAILED,
  SUCCESSFUL,
} from "../../../../microservices/deployment-service/models/deploymentStatus.constants";
import GenericAcknowledgeDialog from "./genericAcknowledgeDialog";
import { store } from "../../../../store/store";
import { ResumeDetailsSlice } from "../../../../store/reducers/resumeDetailsSlice";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function MyResumes() {
  const VERIFY_EMAIL_TOO_MANY_REQUESTS_ERR = "auth/too-many-requests";
  const DELETE_RESUME_ERROR = "Error deleting resume, please try again.";
  const RESUME_ACTION_ERROR_GENERIC =
    "Something went wrong, please refresh the page and try again.";
  const FETCH_RESUMES_ERROR =
    "Unable to retrieve saved resumes, please refresh the page and try again.";
  const EDIT_RESUME_URL = "/createportfolio?editing=true";
  const VIEW_RESUME_URL = "/createportfolio/review?mode=view";
  const auth = getAuth();
  const navigate = useNavigate();
  const [hasResumeActionError, setHasResumeActionError] = useState(false);
  const [resumeActionError, setResumeActionError] = useState(
    RESUME_ACTION_ERROR_GENERIC
  );
  const [userResumes, setUserResumes] = useState<
    Array<IGetResumesForUserResponse>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenericAcknowledgeDialog, setShowGenericAcknowledgeDialog] =
    useState(false);
  const [genericAcknowledgeDialogTitle, setShowGenericAcknowledgeDialogTitle] =
    useState("");
  const [
    genericAcknowledgeDialogContent,
    setShowGenericAcknowledgeDialogContent,
  ] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    const getUserResumesList = async () => {
      try {
        const response = await getResumesForUser();
        setUserResumes(response);
      } catch (err) {
        handleException(FETCH_RESUMES_ERROR);
      }
      setIsLoading(false);
    };
    getUserResumesList();
  }, [auth, navigate]);

  const deleteResume = async (resumeId: string) => {
    setHasResumeActionError(false);
    try {
      const response = await deleteUserResume(resumeId);
      const newUserResumes = userResumes.filter(
        (resume) => resume._id !== resumeId
      );
      setUserResumes(newUserResumes);
    } catch (exception) {
      handleException(DELETE_RESUME_ERROR);
    }
  };

  const handleResumeAction = (url: string, resumeId: string) => {
    setHasResumeActionError(false);
    const resume = userResumes.find((resume) => resume._id === resumeId);
    if (resume) {
      loadResumeIntoReduxStore(resume);
      navigate(url);
    } else {
      handleException(RESUME_ACTION_ERROR_GENERIC);
    }
  };
  const getDeployments = async () => {
    const deployments = await getDeploymentsForUser();
    deployments.sort(
      (a: IGetWebsitesForUserResponse, b: IGetWebsitesForUserResponse) => {
        return b.createdAt - a.createdAt;
      }
    );
    return deployments;
  };

  const handleResumeDeploy = async (resume: IGetResumesForUserResponse) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user?.emailVerified) {
      setShowGenericAcknowledgeDialog(true);
      setShowGenericAcknowledgeDialogTitle("Verify your email");
      setShowGenericAcknowledgeDialogContent(
        <div>
          <Typography gutterBottom>
            Verify your email before deploying your website. Click the verify
            button to have a verification email send to your email. Follow the
            link in the email to verify your email address.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              sendVerificationEmailToUser(user!);
              setShowGenericAcknowledgeDialog(false);
            }}
          >
            Verify Email
          </Button>
        </div>
      );
      return;
    }
    const deployments = await getDeployments();
    const status = deployments[0]?.status.toUpperCase() ?? SUCCESSFUL;
    if (status !== SUCCESSFUL && status !== FAILED && status !== CANCELLED) {
      setShowGenericAcknowledgeDialog(true);
      setShowGenericAcknowledgeDialogTitle("Deployment in progress");
      setShowGenericAcknowledgeDialogContent(
        <Typography gutterBottom>
          You already have a deployment in progress. Please wait for the
          deployment to complete or cancel it before starting a new one
        </Typography>
      );
      return;
    }
    store.dispatch(
      ResumeDetailsSlice.actions.setResumeDetails({
        _id: resume._id,
        completed: true,
        nickname: resume.nickname,
      })
    );
    navigate(`/website/deploy`);
  };

  const handleException = (message: string) => {
    setHasResumeActionError(true);
    setResumeActionError(message);
  };

  const sendVerificationEmailToUser = async (user: User) => {
    try {
      await sendEmailVerification(user);
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.includes(VERIFY_EMAIL_TOO_MANY_REQUESTS_ERR)) {
          alert(
            "Too many requests, please wait before requesting a new verification email."
          );
        }
      }
    }
  };

  const getLoadingTemplate = () => {
    return (
      <li className={"resumes_list_item"} key={"loading_template"}>
        <div className={"resume_list_item_loading"}>
          <h1>Loading</h1>
          <LoadingOutlined />
        </div>
      </li>
    );
  };

  const createNewResume = () => {
    if (userResumes.length > 5) {
      setShowGenericAcknowledgeDialogTitle("Too many resumes");
      setShowGenericAcknowledgeDialogContent(
        "Unable to create a new resume. Users are limited to 5 resumes " +
          "per account, please delete a resume before creating a new one."
      );
      setShowGenericAcknowledgeDialog(true);
      return;
    }
    navigate("/createportfolio");
  };

  const getResumesListAsUICards = () => {
    if (userResumes.length >= 1) {
      return userResumes.map((resume) => {
        return (
          <li className={"resumes_list_item"} key={resume.createdAt}>
            <p className={"resumes_list_item_title"}>{resume.nickname}</p>
            <div className={"resume_list_item_content"}>
              <hr />
              <div className={"resume_list_item_button_container"}>
                <button
                  className={"resumes_list_button_primary"}
                  onClick={() =>
                    handleResumeAction(VIEW_RESUME_URL, resume._id)
                  }
                >
                  View
                </button>
                <button
                  onClick={() =>
                    handleResumeAction(EDIT_RESUME_URL, resume._id)
                  }
                >
                  Edit
                </button>
                <button onClick={() => deleteResume(resume._id)}>Delete</button>
              </div>
              <hr />
              <div className={"resume_list_item_deploy_button"}>
                <button onClick={() => handleResumeDeploy(resume)}>
                  Create Website
                </button>
              </div>
            </div>
          </li>
        );
      });
    }
  };

  return (
    <div>
      {showGenericAcknowledgeDialog ? (
        <GenericAcknowledgeDialog
          title={genericAcknowledgeDialogTitle}
          content={genericAcknowledgeDialogContent}
          open={showGenericAcknowledgeDialog}
          onClose={() => setShowGenericAcknowledgeDialog(false)}
        />
      ) : null}
      {hasResumeActionError ? (
        <Alert
          className={"resumes_action_error"}
          message={resumeActionError}
          type="error"
          closable
        />
      ) : null}
      <ul className={"resumes_list_container"}>
        <li className={"resumes_list_item resumes_list_add_new"}>
          <p className={"resumes_list_item_title"}>Add New Resume</p>
          <div className={"resume_list_item_content"}>
            <img src={addResumeIcon} className={"add_resume_icon"} />
            <div className={"resumes_list_add_new_button_container"}>
              <button onClick={createNewResume}>Add New Resume</button>
            </div>
          </div>
        </li>
        {isLoading ? getLoadingTemplate() : null}
        {getResumesListAsUICards()}
      </ul>
    </div>
  );
}

export default MyResumes;
