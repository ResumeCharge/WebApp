import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { getPersonalInformation } from "../../../store/reducers/personalDetailsSlice";
import { getExtraLinks } from "../../../store/reducers/extraLinksSlice";
import { getCareerSummary } from "../../../store/reducers/careerSummarySlice";
import { getEducation } from "../../../store/reducers/educationSlice";
import { getProjects } from "../../../store/reducers/projectSlice";
import { getSkills } from "../../../store/reducers/skillsSlice";
import { getWorkExperience } from "../../../store/reducers/workExperienceSlice";
import { Alert, Button } from "antd";
import Header from "../../navigation/header/header";
import "./previewPortfolio.scss";
import { getUser } from "../../../store/reducers/userSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { getResumeFromStore } from "../../../utilities/storeHelper";
import {
  saveResumeToDatabase,
  updateResumeInDatabase,
} from "../../../microservices/deployment-service/deploymentService.api";
import { SignUpCard } from "../users/signUp/signUpCard";
import { getAuth } from "firebase/auth";
import { getResumeDetails } from "../../../store/reducers/resumeDetailsSlice";
import SignInCard from "../users/signIn/signInCard";
import { IResume } from "../../../store/reducers/interfaces";
import { getAboutMe } from "../../../store/reducers/aboutMeSlice";
import {
  headingsPlugin,
  listsPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";

const PreviewPortfolio = () => {
  const VIEW_PARAM = "mode";
  const VIEW_MODE_VALUE = "view";
  const auth = getAuth();
  const personalDetails = useAppSelector(getPersonalInformation);
  const aboutMe = useAppSelector(getAboutMe);
  const extraLinks = useAppSelector(getExtraLinks);
  const careerSummary = useAppSelector(getCareerSummary);
  const workExperiencesList = useAppSelector(getWorkExperience);
  const educationList = useAppSelector(getEducation);
  const projectsList = useAppSelector(getProjects);
  const skills = useAppSelector(getSkills);
  const user = useAppSelector(getUser);
  const resumeDetails = useAppSelector(getResumeDetails);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSignUpSignInActive, setIsSignUpSignInActive] = useState(false);
  const [showSignUpOverlay, setShowSignUpOverlay] = useState(false);
  const [showSignInOverlay, setShowSignInOverlay] = useState(false);
  const [showSignUpSignInPrompt, setShowSignUpSignInPrompt] = useState(false);
  const modalRef = React.createRef<HTMLDivElement>();
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const OnClickOutside = () => {
    useEffect(() => {
      const handleClickOutside = (event: any) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setShowSignUpSignInPrompt(false);
          setIsSignUpSignInActive(false);
          setShowSignUpOverlay(false);
          setShowSignInOverlay(false);
        }
      };
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [modalRef]);
  };

  OnClickOutside();

  const handleNextButtonClick = async () => {
    const mode = searchParams.get(VIEW_PARAM);
    const isViewing = mode === VIEW_MODE_VALUE && resumeDetails.completed;
    if (isViewing) {
      navigate("/createportfolio?editing=true");
      return;
    }
    await saveResume();
  };

  const handleBackButtonClick = async () => {
    const mode = searchParams.get(VIEW_PARAM);
    const isViewing = mode === VIEW_MODE_VALUE && resumeDetails.completed;
    if (isViewing) {
      navigate("/account");
    } else {
      navigate("/createportfolio?editing=true");
    }
  };

  const saveResume = async () => {
    if (!auth.currentUser) {
      setIsSignUpSignInActive(true);
      setShowSignUpSignInPrompt(true);
      return;
    }

    setHasError(false);
    setIsLoading(true);
    const resume = getResumeFromStore();
    if (resume._id) {
      await updateResume(resume);
    } else {
      try {
        await saveResumeToDatabase(resume);
        navigate("/account");
      } catch (err) {
        setHasError(true);
      }
    }

    setIsLoading(false);
  };

  const updateResume = async (resume: IResume) => {
    try {
      await updateResumeInDatabase(resume);
      navigate("/account");
    } catch (err) {
      setHasError(true);
    }
  };

  const handleSignUp = () => {
    setShowSignUpOverlay(true);
    setShowSignUpSignInPrompt(false);
  };

  const handleSignUpSuccess = () => {
    setShowSignUpOverlay(false);
    setIsLoading(true);
    saveResume();
  };

  const handleSignInSuccess = () => {
    setShowSignInOverlay(false);
    setIsLoading(true);
    saveResume();
  };

  const handleSignIn = () => {
    setShowSignInOverlay(true);
    setShowSignUpSignInPrompt(false);
  };

  const getSignUpSignInPrompt = () => {
    return (
      <div className={"preview_signup_signin"}>
        <h1>Sign up or sign in to continue</h1>
        <button onClick={handleSignUp}>Sign Up</button>
        <button onClick={handleSignIn}>Sign In</button>
      </div>
    );
  };

  const getActionButtons = () => {
    const returnButtonText = "Back";
    return (
      <div className={"preview_buttons_container"}>
        <button
          className={"preview_buttons_back"}
          onClick={handleBackButtonClick}
        >
          {returnButtonText}
        </button>
        {getNextButton()}
      </div>
    );
  };

  const getNextButton = () => {
    const mode = searchParams.get(VIEW_PARAM);
    const isViewing = mode === VIEW_MODE_VALUE && resumeDetails.completed;
    let nextButtonText = isViewing ? "Edit" : "Save and Continue";
    return (
      <button
        className={`preview_buttons_next ${isLoading ? "disabled" : null}`}
        onClick={handleNextButtonClick}
        disabled={isLoading}
      >
        {isLoading ? <LoadingOutlined /> : nextButtonText}
      </button>
    );
  };

  return (
    <div className={"preview_overlay_container"}>
      {showSignUpOverlay ? (
        <div className={"preview_signup_overlay"} ref={modalRef}>
          <SignUpCard onSuccess={handleSignUpSuccess} />
        </div>
      ) : null}
      {showSignInOverlay ? (
        <div className={"preview_signup_overlay"} ref={modalRef}>
          <SignInCard onSuccess={handleSignInSuccess} />
        </div>
      ) : null}
      {showSignUpSignInPrompt ? (
        <div className={"preview_signup_signin_prompt_overlay"} ref={modalRef}>
          {getSignUpSignInPrompt()}
        </div>
      ) : null}
      <div
        className={"preview_container"}
        style={isSignUpSignInActive ? { pointerEvents: "none" } : undefined}
      >
        <Header />
        {hasError ? (
          <Alert
            message="Error saving resume, please try again later or contact support if the error persists"
            className={"preview_error_message"}
            showIcon
            type="error"
            closable
          />
        ) : null}
        <div className={"preview_content_container"}>
          <div className={"preview_title"}>
            <h1 className={"preview_page_title"}>Review</h1>
            <p className={"preview_page_title_subtext"}>
              Take a moment to review and make sure everything is correct.
            </p>
          </div>
          <h1 className={"preview_section_title"}>Personal Details</h1>
          <div className={"preview_content_section preview_personal_details"}>
            <div className={"preview_personal_details_item"}>
              <h3>Name</h3>
              <p>
                {personalDetails.firstName} {personalDetails.lastName}
              </p>
            </div>
            <div className={"preview_personal_details_item"}>
              <h3>Email</h3>
              <p>{personalDetails.email}</p>
            </div>
            <div className={"preview_personal_details_item"}>
              <h3>Phone Number</h3>
              <p>{personalDetails.phone}</p>
            </div>
            <div className={"preview_personal_details_item"}>
              <h3>LinkedIn</h3>
              <p>{personalDetails.linkedin}</p>
            </div>
            <div className={"preview_personal_details_item"}>
              <h3>Github</h3>
              <p>{personalDetails.github}</p>
            </div>
          </div>
          <div className={"preview_content_section preview_aboutme"}>
            <h1 className={"preview_section_title"}>About Me</h1>
            {aboutMe.aboutMe ? (
              <MDXEditor
                contentEditableClassName={"preview_md_content"}
                readOnly={true}
                markdown={aboutMe.aboutMe}
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  thematicBreakPlugin(),
                ]}
              />
            ) : null}
          </div>
          <h1 className={"preview_section_title"}>Extra Links</h1>
          <div className={"preview_content_section preview_extra_links"}>
            <ul>
              {extraLinks.map((link) => {
                return (
                  <li key={link.id} className={"preview_extra_links_item"}>
                    <p className={"preview_extra_links_item_name"}>
                      {link.linkName}
                    </p>
                    <p className={"preview_extra_links_item_value"}>
                      {link.linkValue}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={"preview_content_section preview_career_summary"}>
            <h1 className={"preview_section_title"}>Career Summary</h1>
            {careerSummary.summary ? (
              <MDXEditor
                contentEditableClassName={"preview_md_content"}
                readOnly={true}
                markdown={careerSummary.summary}
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  thematicBreakPlugin(),
                ]}
              />
            ) : null}
          </div>
          <div className={"preview_content_section preview_work_experience"}>
            <h1 className={"preview_section_title"}>Work Experience</h1>
            <ul className={"preview_work_experience_list"}>
              {workExperiencesList.map((workExperience) => {
                return (
                  <li
                    key={workExperience.id}
                    className={"preview_work_experience_list_item"}
                  >
                    <p className={"work_experience_role"}>
                      {workExperience.roleName}
                    </p>
                    <div className={"work_experience_start_end_date"}>
                      <p>{workExperience.startDate}</p>
                      <p>{workExperience.endDate}</p>
                    </div>
                    <p>{workExperience.company}</p>
                    <p className={"work_experience_location"}>
                      {workExperience.location}
                    </p>
                    {workExperience.details ? (
                      <MDXEditor
                        contentEditableClassName={"preview_md_content"}
                        readOnly={true}
                        markdown={workExperience.details}
                        plugins={[
                          headingsPlugin(),
                          listsPlugin(),
                          quotePlugin(),
                          thematicBreakPlugin(),
                        ]}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={"preview_content_section preview_education"}>
            <h1 className={"preview_section_title"}>Education</h1>
            <ul className={"education_list"}>
              {educationList.map((education) => {
                return (
                  <li key={education.id} className={"education_list_item"}>
                    <p className={"education_list_item_degree"}>
                      {education.degree}
                    </p>
                    <p className={"education_list_item_university"}>
                      {education.university}
                    </p>
                    <div className={"education_list_item_start_end_date"}>
                      <p>{education.startDate}</p>
                      <p>{education.endDate}</p>
                    </div>

                    {education.details ? (
                      <MDXEditor
                        contentEditableClassName={"preview_md_content"}
                        readOnly={true}
                        markdown={education.details}
                        plugins={[
                          headingsPlugin(),
                          listsPlugin(),
                          quotePlugin(),
                          thematicBreakPlugin(),
                        ]}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={"preview_content_section preview_projects"}>
            <h1 className={"preview_section_title"}>Projects</h1>
            <ul className={"projects_list"}>
              {projectsList.map((project) => {
                return (
                  <li key={project.id} className={"projects_list_item"}>
                    <p className={"projects_list_item_title"}>
                      {project.title}
                    </p>
                    {project.details ? (
                      <MDXEditor
                        contentEditableClassName={"preview_md_content"}
                        readOnly={true}
                        markdown={project.details}
                        plugins={[
                          headingsPlugin(),
                          listsPlugin(),
                          quotePlugin(),
                          thematicBreakPlugin(),
                        ]}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={"preview_content_section preview_skills"}>
            <h1 className={"preview_section_title"}>Skills</h1>
            {skills.skills ? (
              <MDXEditor
                contentEditableClassName={"preview_md_content"}
                readOnly={true}
                markdown={skills.skills}
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  thematicBreakPlugin(),
                ]}
              />
            ) : null}
          </div>
        </div>
        {getActionButtons()}
      </div>
    </div>
  );
};

export default PreviewPortfolio;
