import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IWorkExperience } from "./interfaces";

const initialState = new Array<IWorkExperience>();

export const WorkExperienceSlice = createSlice({
  name: "workExperience",
  initialState,
  reducers: {
    addWorkExperience: {
      reducer(state, action: PayloadAction<IWorkExperience>) {
        state.push(action.payload);
      },
      prepare(payload: {
        roleName: string;
        company: string;
        location: string;
        startDate: string;
        endDate: string;
        details: string;
      }) {
        const id = nanoid();
        return {
          payload: {
            ...payload,
            id,
          },
        };
      },
    },
    setWorkExperience(state, action: PayloadAction<Array<IWorkExperience>>) {
      action.payload.forEach((workExperience, index) => {
        workExperience.id = nanoid();
      });
      return action.payload;
    },
    removeWorkExperience(state, action: PayloadAction<string>) {
      return state.filter((workExperience) => {
        return workExperience.id !== action.payload;
      });
    },
    reset() {
      return initialState;
    },
  },
});

export const {
  addWorkExperience,
  setWorkExperience,
  reset,
  removeWorkExperience,
} = WorkExperienceSlice.actions;

export const getWorkExperience = (state: RootState) =>
  state.WorkExperienceReducer;

export default WorkExperienceSlice.reducer;
