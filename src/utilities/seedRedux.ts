import { store } from "../store/store";
import { PersonalDetailsSlice } from "../store/reducers/personalDetailsSlice";
import { ExtraLinksSlice } from "../store/reducers/extraLinksSlice";
import { CareerSummarySlice } from "../store/reducers/careerSummarySlice";
import { WorkExperienceSlice } from "../store/reducers/workExperienceSlice";
import { EducationSlice } from "../store/reducers/educationSlice";
import { ProjectsSlice } from "../store/reducers/projectSlice";
import { SkillsSlice } from "../store/reducers/skillsSlice";
import { IPersonalDetails, IResumeDetails } from "../store/reducers/interfaces";
import { ResumeDetailsSlice } from "../store/reducers/resumeDetailsSlice";
import { AboutMeSlice } from "../store/reducers/aboutMeSlice";

export const seedRedux = () => {
  const resumeDetails: IResumeDetails = {
    nickname: "Amazon Resume",
    completed: true,
  };
  store.dispatch(ResumeDetailsSlice.actions.setResumeDetails(resumeDetails));

  const personalDetails: IPersonalDetails = {
    firstName: "Adam",
    lastName: "Lawson",
    avatar: "someFile.jpg",
    email: "adamlawson@gmail.com",
    phone: "6136065783",
    website: "adamlawson.dev",
    linkedin: "alaws99",
    github: "adam99lawson",
    languages: [],
  };
  store.dispatch(
    PersonalDetailsSlice.actions.setPersonalInformation(personalDetails)
  );

  let extraLinks = {
    linkName: "twitter",
    linkValue: "somecoolname",
  };
  store.dispatch(ExtraLinksSlice.actions.addExtraLink(extraLinks));
  extraLinks = {
    linkName: "bitbucket",
    linkValue: "MyLongBitBucketUsername",
  };
  store.dispatch(ExtraLinksSlice.actions.addExtraLink(extraLinks));

  const careerSummary = {
    summary: "I had an awesome career",
  };
  store.dispatch(CareerSummarySlice.actions.setCareerSummary(careerSummary));

  const aboutMe = {
    aboutMe: "My cool about me!",
  };

  store.dispatch(AboutMeSlice.actions.setAboutMe(aboutMe));

  let workExperience = {
    roleName: "Senior Software Engineer",
    company: "Amazon",
    location: "Toronto",
    startDate: "September 2012",
    endDate: "March 2018",
    details: "asdfasdf",
  };

  store.dispatch(WorkExperienceSlice.actions.addWorkExperience(workExperience));

  workExperience = {
    roleName: "QA Tester",
    company: "Google",
    location: "Prague, Czech Republic",
    startDate: "September 2005",
    endDate: "December 2018",
    details: "Did some cool stuff",
  };

  store.dispatch(WorkExperienceSlice.actions.addWorkExperience(workExperience));

  let education = {
    degree: "B.ASc Software Engineering",
    university: "University of Ottawa",
    startDate: "September 2017",
    endDate: "December 2021",
    details: "sadfsadf",
  };
  store.dispatch(EducationSlice.actions.addEducation(education));

  education = {
    degree: "B.Comm",
    university: "University of Ottawa - Telfer",
    startDate: "January 2007",
    endDate: "May 2011",
    details: "sadfsadf",
  };

  store.dispatch(EducationSlice.actions.addEducation(education));

  let project = {
    title: "Discord Bot",
    details: "**Discord Bot built with python**",
  };

  store.dispatch(ProjectsSlice.actions.addProject(project));

  project = {
    title: "Tic Tac Toe",
    details: "sdfasdfsa",
  };

  store.dispatch(ProjectsSlice.actions.addProject(project));

  store.dispatch(
    SkillsSlice.actions.setSkills({ skills: "My awesome skills" })
  );
};
