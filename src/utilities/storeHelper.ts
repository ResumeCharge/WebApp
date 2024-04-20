import { store } from "../store/store";
import { IResume } from "../store/reducers/interfaces";
import { ResumeDetailsSlice } from "../store/reducers/resumeDetailsSlice";
import { PersonalDetailsSlice } from "../store/reducers/personalDetailsSlice";
import { ExtraLinksSlice } from "../store/reducers/extraLinksSlice";
import { CareerSummarySlice } from "../store/reducers/careerSummarySlice";
import { EducationSlice } from "../store/reducers/educationSlice";
import { WorkExperienceSlice } from "../store/reducers/workExperienceSlice";
import { ProjectsSlice } from "../store/reducers/projectSlice";
import { SkillsSlice } from "../store/reducers/skillsSlice";

export const getResumeFromStore = (): IResume => {
  const nickname = store.getState().ResumeDetailsReducer.nickname;
  const _id = store.getState().ResumeDetailsReducer._id;
  const userId = store.getState().UserReducer.userId;
  const personalDetails = store.getState().PersonalInformationReducer;
  const extraLinkList = store.getState().ExtraLinksReducer;
  const careerSummary = store.getState().CareerSummaryReducer;
  const educationList = store.getState().EducationReducer;
  const workExperienceList = store.getState().WorkExperienceReducer;
  const projectsList = store.getState().ProjectsReducer;
  const skills = store.getState().SkillsReducer;
  //const awardsAndAccoladesList = store.getState();
  const aboutMe = store.getState().AboutMeReducer;
  const extraWebsiteDetails = new Map<string, string>();
  return {
    _id,
    nickname,
    userId,
    personalDetails,
    extraLinkList,
    careerSummary,
    educationList,
    workExperienceList,
    projectsList,
    skills,
    aboutMe,
    extraWebsiteDetails,
  };
};

export const clearResumeFromStore = () => {
  store.dispatch(ResumeDetailsSlice.actions.reset());
  store.dispatch(PersonalDetailsSlice.actions.reset());
  store.dispatch(ExtraLinksSlice.actions.reset());
  store.dispatch(CareerSummarySlice.actions.reset());
  store.dispatch(EducationSlice.actions.reset());
  store.dispatch(WorkExperienceSlice.actions.reset());
  store.dispatch(ProjectsSlice.actions.reset());
  store.dispatch(SkillsSlice.actions.reset());
};
