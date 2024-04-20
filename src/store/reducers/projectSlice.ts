import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IProject } from "./interfaces";

const initialState = new Array<IProject>();

export const ProjectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    addProject: {
      reducer(state, action: PayloadAction<IProject>) {
        state.push(action.payload);
      },
      prepare(payload: { title: string; details: string }) {
        const id = nanoid();
        return {
          payload: {
            ...payload,
            id,
          },
        };
      },
    },
    setProjects(state, action: PayloadAction<Array<IProject>>) {
      action.payload.forEach((project, index) => {
        project.id = nanoid();
      });
      return action.payload;
    },
    removeProject(state, action: PayloadAction<String>) {
      return state.filter((project) => {
        return project.id !== action.payload;
      });
    },
    reset() {
      return initialState;
    },
  },
});

export const { addProject, removeProject, setProjects, reset } =
  ProjectsSlice.actions;

export const getProjects = (state: RootState) => state.ProjectsReducer;

export default ProjectsSlice.reducer;
