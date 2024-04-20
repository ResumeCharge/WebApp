import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IEducation } from "./interfaces";

const initialState = new Array<IEducation>();

export const EducationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    addEducation: {
      reducer(state, action: PayloadAction<IEducation>) {
        state.push(action.payload);
      },
      prepare(payload: {
        degree: string;
        university: string;
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
    setEducation(state, action: PayloadAction<Array<IEducation>>) {
      action.payload.forEach((education, index) => {
        education.id = nanoid();
      });
      return action.payload;
    },
    removeEducation(state, action: PayloadAction<string>) {
      return state.filter((education) => {
        return education.id !== action.payload;
      });
    },
    reset() {
      return initialState;
    },
  },
});

export const { addEducation, setEducation, removeEducation, reset } =
  EducationSlice.actions;

export const getEducation = (state: RootState) => state.EducationReducer;

export default EducationSlice.reducer;
