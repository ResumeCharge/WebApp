import { configureStore } from "@reduxjs/toolkit";
import PersonalInformationReducer from "./reducers/personalDetailsSlice";
import ExtraLinksReducer from "./reducers/extraLinksSlice";
import EducationReducer from "./reducers/educationSlice";
import ProjectsReducer from "./reducers/projectSlice";
import SkillsReducer from "./reducers/skillsSlice";
import CareerSummaryReducer from "./reducers/careerSummarySlice";
import WorkExperienceReducer from "./reducers/workExperienceSlice";
import UserReducer from "./reducers/userSlice";
import ResumeDetailsReducer from "./reducers/resumeDetailsSlice";
import AboutMeReducer from "./reducers/aboutMeSlice";

export const store = configureStore({
  reducer: {
    PersonalInformationReducer,
    ExtraLinksReducer,
    EducationReducer,
    ProjectsReducer,
    SkillsReducer,
    CareerSummaryReducer,
    WorkExperienceReducer,
    UserReducer,
    ResumeDetailsReducer,
    AboutMeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
