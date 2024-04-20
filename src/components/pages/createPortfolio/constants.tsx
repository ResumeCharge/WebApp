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
  NICKNAME: "nickname",
  PERSONAL_INFORMATION: "personal-information",
  ABOUT_ME: "about-me",
  EXTRA_LINKS: "extra-links",
  CAREER_SUMMARY: "career-summary",
  WORK_EXPERIENCE: "work-experience",
  EDUCATION: "education",
  PROJECTS: "projects",
  SKILLS: "skills",
};
