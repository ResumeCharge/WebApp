import { User } from "../../microservices/user-service/userService.interface";

export interface IResume {
  _id?: string;
  nickname: string;
  userId: string;
  personalDetails: IPersonalDetails;
  extraLinkList?: Array<IExtraLink>;
  careerSummary: ICareerSummary;
  educationList?: Array<IEducation>;
  workExperienceList?: Array<IWorkExperience>;
  projectsList?: Array<IProject>;
  skills?: ISkills;
  awardsAndAccoladesList?: Array<IAwardAndAccolade>;
  aboutMe?: IAboutMe;
  extraWebsiteDetails: Map<string, string>;
}

export interface IAwardAndAccolade {
  name: string;
  organization: string;
  details: string;
  yearsObtained: Array<number>;
}

export interface ICareerSummary {
  summary: string;
}

export interface IAboutMe {
  aboutMe: string;
}

export interface IPersonalDetails {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
  languages: Array<ILanguage>;
}

export interface ILanguage {
  name: string;
  proficiency: string;
  id: string;
}

export interface IProject {
  title: string;
  details: string;
  id: string;
}

export interface ISkills {
  skills: string;
}

export interface IWorkExperience {
  roleName: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string;
  id: string;
}

export interface IEducation {
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
  details: string;
  id: string;
}

export interface IExtraLink {
  linkName: string;
  linkValue: string;
  id: string;
}

export interface IResumeDetails {
  nickname: string;
  _id?: string;
  completed?: boolean;
  creatingNewResume?: boolean;
}

export interface IUser extends Partial<User> {
  userId: string;
  isSignedIn: boolean;
  websiteIdentifier: string | null;
}
