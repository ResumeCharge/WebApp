export interface ISection {
  content: JSX.Element;
  id: string;
  title: string;
  isComplete: boolean;
  isDisabled: boolean;
  isActive: boolean;
  next?: string;
  prev?: string;
  isFinalSection?: boolean;
}

export const sectionIds = {
  PERSONAL_INFORMATION: "personal-information",
  ABOUT_ME: "about-me",
  PROFILE_PICTURE: "profile-picture",
  EXTRA_LINKS: "extra-links",
  CAREER_SUMMARY: "career-summary",
  WORK_EXPERIENCE: "work-experience",
  EDUCATION: "education",
  PROJECTS: "projects",
  SKILLS: "skills",
};
