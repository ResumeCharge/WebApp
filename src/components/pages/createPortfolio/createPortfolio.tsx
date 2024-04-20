import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./createPortfolio.scss";
import Header from "../../navigation/header/header";
import { SideNav } from "../../navigation/sideNav/sideNav";
import { useNavigate, useSearchParams } from "react-router-dom";
import PersonalInformation from "./forms/personalInformation/personalInformation";
import ExtraLinks from "./forms/extraLinks/extraLinks";
import CareerSummary from "./forms/careerSummary/careerSummary";
import WorkExperience from "./forms/workExperience/workExperience";
import Education from "./forms/education/education";
import Projects from "./forms/projects/projects";
import Skills from "./forms/skills/skills";
import { useAppSelector } from "../../../store/hooks";
import { getResumeDetails } from "../../../store/reducers/resumeDetailsSlice";
import { getUser } from "../../../store/reducers/userSlice";
import { clearResumeFromStore } from "../../../utilities/storeHelper";
import { ISection } from "./createPortfolio.contants";
import { sectionIds } from "./constants";
import AboutMe from "./forms/aboutMe/aboutMe";
import Nickname from "./forms/nickname/nickname";

function CreatePortfolio() {
  const [editing, setEditing] = useState(false);
  const [activeSection, setActiveSection] = useState(sectionIds.NICKNAME);
  const [sectionsMap, setSectionsMap] = useState<Map<string, ISection>>(
    new Map([
      [
        sectionIds.NICKNAME,
        {
          content: (
            <Nickname
              onComplete={() => handleSectionComplete(sectionIds.NICKNAME)}
              back={() => handleBackEvent(sectionIds.NICKNAME)}
            />
          ),
          id: sectionIds.NICKNAME,
          title: "Resume Name",
          isComplete: false,
          isDisabled: false,
          isActive: true,
          next: sectionIds.PERSONAL_INFORMATION,
        },
      ],
      [
        sectionIds.PERSONAL_INFORMATION,
        {
          content: (
            <PersonalInformation
              onComplete={() =>
                handleSectionComplete(sectionIds.PERSONAL_INFORMATION)
              }
              back={() => handleBackEvent(sectionIds.PERSONAL_INFORMATION)}
            />
          ),
          id: sectionIds.PERSONAL_INFORMATION,
          title: "Personal Information",
          isComplete: false,
          isDisabled: !editing,
          isActive: false,
          prev: sectionIds.NICKNAME,
          next: sectionIds.ABOUT_ME,
        },
      ],
      [
        sectionIds.ABOUT_ME,
        {
          content: (
            <AboutMe
              onComplete={() => handleSectionComplete(sectionIds.ABOUT_ME)}
              back={() => handleBackEvent(sectionIds.ABOUT_ME)}
            />
          ),
          id: sectionIds.ABOUT_ME,
          title: "About Me",
          isComplete: false,
          isDisabled: !editing,
          isActive: false,
          prev: sectionIds.PERSONAL_INFORMATION,
          next: sectionIds.EXTRA_LINKS,
        },
      ],
      [
        sectionIds.EXTRA_LINKS,
        {
          content: (
            <ExtraLinks
              onComplete={() => handleSectionComplete(sectionIds.EXTRA_LINKS)}
              back={() => handleBackEvent(sectionIds.EXTRA_LINKS)}
            />
          ),
          id: sectionIds.EXTRA_LINKS,
          title: "Extra Links",
          isComplete: false,
          isDisabled: !editing,
          isActive: false,
          prev: sectionIds.ABOUT_ME,
          next: sectionIds.CAREER_SUMMARY,
        },
      ],
      [
        sectionIds.CAREER_SUMMARY,
        {
          content: (
            <CareerSummary
              onComplete={() =>
                handleSectionComplete(sectionIds.CAREER_SUMMARY)
              }
              back={() => handleBackEvent(sectionIds.CAREER_SUMMARY)}
            />
          ),
          id: sectionIds.CAREER_SUMMARY,
          title: "Career Summary",
          isComplete: false,
          isDisabled: !editing,
          isActive: false,
          prev: sectionIds.EXTRA_LINKS,
          next: sectionIds.WORK_EXPERIENCE,
        },
      ],
      [
        sectionIds.WORK_EXPERIENCE,
        {
          content: (
            <WorkExperience
              onComplete={() =>
                handleSectionComplete(sectionIds.WORK_EXPERIENCE)
              }
              back={() => handleBackEvent(sectionIds.WORK_EXPERIENCE)}
            />
          ),
          id: sectionIds.WORK_EXPERIENCE,
          title: "Work Experience",
          isComplete: false,
          isDisabled: !editing,
          isActive: false,
          prev: sectionIds.CAREER_SUMMARY,
          next: sectionIds.EDUCATION,
        },
      ],
      [
        sectionIds.EDUCATION,
        {
          content: (
            <Education
              onComplete={() => handleSectionComplete(sectionIds.EDUCATION)}
              back={() => handleBackEvent(sectionIds.EDUCATION)}
            />
          ),
          id: sectionIds.EDUCATION,
          title: "Education",
          isComplete: false,
          isDisabled: !editing,
          isActive: false,
          prev: sectionIds.WORK_EXPERIENCE,
          next: sectionIds.PROJECTS,
        },
      ],
      [
        sectionIds.PROJECTS,
        {
          content: (
            <Projects
              onComplete={() => handleSectionComplete(sectionIds.PROJECTS)}
              back={() => handleBackEvent(sectionIds.PROJECTS)}
            />
          ),
          id: sectionIds.PROJECTS,
          title: "Projects",
          isComplete: false,
          isDisabled: !editing,
          isActive: false,
          prev: sectionIds.EDUCATION,
          next: sectionIds.SKILLS,
        },
      ],
      [
        sectionIds.SKILLS,
        {
          content: (
            <Skills
              onComplete={() => handleSectionComplete(sectionIds.SKILLS)}
              back={() => handleBackEvent(sectionIds.SKILLS)}
            />
          ),
          id: sectionIds.SKILLS,
          title: "Skills",
          isComplete: false,
          isDisabled: !editing,
          isActive: false,
          prev: sectionIds.PROJECTS,
          isFinalSection: true,
        },
      ],
    ])
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const resumeDetails = useAppSelector(getResumeDetails);
  const user = useAppSelector(getUser);
  const navigate = useNavigate();
  const OnPageHideEvent = () => {
    useEffect(() => {
      const handleHidePageEvent = (event: Event) => {
        const isOk = window.confirm("Changes will be lost upon refresh");
        if (!isOk) {
          event.preventDefault();
        }
      };
      // Bind the event listener
      window.addEventListener("beforeunload", handleHidePageEvent);
      return () => {
        // Unbind the event listener on clean up
        window.removeEventListener("beforeunload", handleHidePageEvent);
      };
    }, []);
  };
  OnPageHideEvent();

  useEffect(() => {
    const isEditing = searchParams.get("editing");
    if (isEditing === "true") {
      if (!resumeDetails.completed) {
        user.isSignedIn ? navigate("/account") : navigate("/createportfolio");
      }
      setAllSectionsActive();
      setEditing(true);
    } else {
      clearResumeFromStore();
      setIsLoading(false);
    }
  }, [
    editing,
    navigate,
    resumeDetails.completed,
    searchParams,
    isLoading,
    user.isSignedIn,
  ]);

  const setAllSectionsActive = () => {
    const newSectionsMap = new Map<string, ISection>();
    sectionsMap.forEach((section, sectionId) => {
      const enabledSection = {
        ...section,
        isDisabled: false,
      };
      newSectionsMap.set(sectionId, enabledSection);
    });
    setSectionsMap(newSectionsMap);
  };

  const menu = (
    <Menu onClick={(event) => handleMenuClick("event")}>
      <Menu.Item key="github-account" icon={<UserOutlined />}>
        Github Account
      </Menu.Item>
      <Menu.Item key="personal-information" icon={<UserOutlined />}>
        Personal Information
      </Menu.Item>
      <Menu.Item key="career-summary" icon={<UserOutlined />}>
        Career Summary
      </Menu.Item>
    </Menu>
  );

  const handleSectionComplete = (currentSectionId: string) => {
    let currentSection = sectionsMap.get(currentSectionId);
    if (currentSection === undefined) return;
    if (currentSection.isFinalSection) {
      navigate("/createportfolio/review");
      return;
    }
    if (!currentSection.next) return;
    const nextSectionId = currentSection.next;
    let nextSection = sectionsMap.get(nextSectionId);
    if (!nextSection) return;
    const updatedCurrentSection = {
      ...currentSection,
      isComplete: true,
      isActive: false,
      isDisabled: false,
    };
    nextSection = { ...nextSection, isActive: true, isDisabled: false };
    sectionsMap.set(currentSection.id, updatedCurrentSection);
    sectionsMap.set(nextSectionId, nextSection);
    setActiveSection(nextSectionId);
  };

  const handleBackEvent = (currentSectionId: string) => {
    if (currentSectionId === sectionIds.NICKNAME) {
      const isOk = window.confirm(
        "Any unsaved changes will be lost upon leaving this page"
      );
      if (isOk) {
        navigate("/account");
      }
    }

    let currentSection = sectionsMap.get(currentSectionId);
    if (currentSection === undefined || !currentSection.prev) return;
    const prevSectionId = currentSection.prev;
    let prevSection = sectionsMap.get(prevSectionId);
    if (!prevSection) return;
    currentSection = { ...currentSection, isActive: false };
    prevSection = { ...prevSection, isActive: true };
    sectionsMap.set(currentSection.id, currentSection);
    sectionsMap.set(prevSectionId, prevSection);
    setActiveSection(prevSectionId);
  };

  function handleMenuClick(sectionId: string) {
    if (sectionId === activeSection) return;
    const section = sectionsMap.get(sectionId);
    if (section && !section.isDisabled) {
      setActiveSection(sectionId);
    }
  }

  const activeForm = (
    <div>
      {Array.from(sectionsMap, ([sectionId, section]) => ({
        sectionId,
        section,
      })).map(({ sectionId, section }) => {
        return (
          <div key={sectionId}>
            {activeSection === sectionId ? (
              <div className={"cp_active_content"}>{section.content}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={"cp_container"}>
      <Header disableMainButtons={true} />
      <div className={"cp_container_content"}>
        <div className={"cp_main"}>
          <div className={"cp_sideNav"}>
            <SideNav
              sectionsMap={sectionsMap}
              handleMenuClick={handleMenuClick}
              activeSection={activeSection}
            />
          </div>
          <div className={"cp_content"}>
            <div className={"cp_forms"}>{activeForm}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePortfolio;
