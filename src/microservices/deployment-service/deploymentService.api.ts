import { IResume, IResumeDetails } from "../../store/reducers/interfaces";
import { getAuth } from "firebase/auth";
import { store } from "../../store/store";
import { PersonalDetailsSlice } from "../../store/reducers/personalDetailsSlice";
import { CareerSummarySlice } from "../../store/reducers/careerSummarySlice";
import { EducationSlice } from "../../store/reducers/educationSlice";
import { ExtraLinksSlice } from "../../store/reducers/extraLinksSlice";
import { ProjectsSlice } from "../../store/reducers/projectSlice";
import { SkillsSlice } from "../../store/reducers/skillsSlice";
import { WorkExperienceSlice } from "../../store/reducers/workExperienceSlice";
import { ResumeDetailsSlice } from "../../store/reducers/resumeDetailsSlice";
import { IDeployment } from "./models/deployment.model";
import { AboutMeSlice } from "../../store/reducers/aboutMeSlice";
import { API_PREFIX } from "../../app.constants";

const GET_SUCCESS = 200;
const DELETE_SUCCESS = 200;
const POST_SUCCESS = 201;
const PATCH_SUCCESS = 200;
const TEMPLATES_ENDPOINT = API_PREFIX + "/templates";
const RESUMES_ENDPOINT = API_PREFIX + "/resumes";
const DEPLOYMENTS_ENDPOINT = API_PREFIX + "/deployments";

export const deployWebsite = async (deployment: IDeployment) => {
  const user = getActiveUser();
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(DEPLOYMENTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: tokenHeaderValue,
    },
    body: JSON.stringify(deployment),
  });
  const responseJson = await response.json();
  if (response.status === POST_SUCCESS) {
    return responseJson;
  } else {
    throw new Error(responseJson.message);
  }
};

export const getResumesForUser = async () => {
  const user = getActiveUser();
  const userId = user.uid;
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(`${RESUMES_ENDPOINT}/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: tokenHeaderValue,
    },
  });
  if (response.status === GET_SUCCESS) {
    return await response.json();
  } else {
    throw new Error("Unable to get resumes for user");
  }
};

export const deleteUserResume = async (resumeId: string) => {
  const user = getActiveUser();
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(`${RESUMES_ENDPOINT}/${resumeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: tokenHeaderValue,
    },
  });
  if (response.status === GET_SUCCESS) {
    return await response.json();
  } else {
    throw new Error("Unable to get resumes for user");
  }
};

export const getDeploymentsForUser = async () => {
  const user = getActiveUser();
  const userId = user.uid;
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(`${DEPLOYMENTS_ENDPOINT}/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: tokenHeaderValue,
    },
  });
  if (response.status === GET_SUCCESS) {
    return await response.json();
  } else {
    throw new Error();
  }
};

export const getDeploymentForUser = async (deploymentId: string) => {
  const user = getActiveUser();
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(`${DEPLOYMENTS_ENDPOINT}/${deploymentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: tokenHeaderValue,
    },
  });
  if (response.status === GET_SUCCESS) {
    return await response.json();
  } else {
    throw new Error();
  }
};

export const saveResumeToDatabase = async (resume: IResume) => {
  const user = getActiveUser();
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(RESUMES_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: tokenHeaderValue,
    },
    body: JSON.stringify(resume),
  });
  if (response.status === POST_SUCCESS) {
    return await response.json();
  } else {
    throw new Error("Error saving resume to database");
  }
};

export const updateResumeInDatabase = async (resume: IResume) => {
  const user = getActiveUser();
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(`${RESUMES_ENDPOINT}/${resume._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: tokenHeaderValue,
    },
    body: JSON.stringify(resume),
  });
  if (response.status === PATCH_SUCCESS) {
    return await response.json();
  } else {
    throw new Error("Error updating resume in database");
  }
};

export const loadResumeIntoReduxStore = (
  resume: IGetResumesForUserResponse
) => {
  const personalDetails = resume.personalDetails;
  store.dispatch(
    PersonalDetailsSlice.actions.setPersonalInformation(personalDetails)
  );
  const aboutMe = resume.aboutMe;
  store.dispatch(AboutMeSlice.actions.setAboutMe(aboutMe));
  const careerSummary = resume.careerSummary;
  store.dispatch(CareerSummarySlice.actions.setCareerSummary(careerSummary));
  const education = resume.educationList ? resume.educationList : [];
  store.dispatch(EducationSlice.actions.setEducation(education));
  const extraLinks = resume.extraLinkList ? resume.extraLinkList : [];
  store.dispatch(ExtraLinksSlice.actions.setExtraLinks(extraLinks));
  const projects = resume.projectsList ? resume.projectsList : [];
  store.dispatch(ProjectsSlice.actions.setProjects(projects));
  const skills = resume.skills;
  store.dispatch(SkillsSlice.actions.setSkills(skills));
  const workExperience = resume.workExperienceList
    ? resume.workExperienceList
    : [];
  store.dispatch(WorkExperienceSlice.actions.setWorkExperience(workExperience));
  const resumeDetails: IResumeDetails = {
    nickname: resume.nickname,
    _id: resume._id,
    completed: true,
  };
  store.dispatch(ResumeDetailsSlice.actions.setResumeDetails(resumeDetails));
};

export const getAvailableTemplates = async (): Promise<
  Array<IGetAvailableTemplatesResponse>
> => {
  const response = await fetch(`${TEMPLATES_ENDPOINT}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === GET_SUCCESS) {
    const data = await response.json();
    return data.map((template: IGetAvailableTemplatesResponse) => {
      const templateItem: IGetAvailableTemplatesResponse = {
        _id: template._id,
        description: template.description,
        mainImage: template.mainImage,
        subImages: template.subImages,
        name: template.name,
        price: template.price,
        priceId: template.priceId,
      };
      return templateItem;
    });
  } else {
    throw new Error();
  }
};

export const cancelDeployment = async (deploymentId: string): Promise<void> => {
  const user = getActiveUser();
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(
    `${DEPLOYMENTS_ENDPOINT}/${deploymentId}/cancel`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenHeaderValue,
      },
    }
  );
  if (response.status !== DELETE_SUCCESS) {
    throw new Error();
  }
};

const getActiveUser = () => {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error("No active user, unable to getUser");
  }
  return auth.currentUser;
};

const getBearerTokenHeader = (token: string) => {
  return "Bearer " + token;
};

export interface IGetResumesForUserResponse extends IResume {
  _id: string;
  userId: string;
  createdAt: number;
  lastUpdatedAt: number;
  nickname: string;
}

export interface IGetWebsitesForUserResponse {
  _id: string;
  userId: string;
  createdAt: number;
  lastUpdatedAt: number;
  progress: number;
  status: string;
  deployedUrl: string;
  cancellationRequested: boolean;
  websiteDetails: {
    description: string;
    title: string;
    resumeName: string;
    templateName: string;
  };
}

export interface IGetAvailableTemplatesResponse {
  _id: string;
  description: string;
  mainImage: string;
  subImages: Array<string>;
  name: string;
  price: number;
  priceId: string;
}
