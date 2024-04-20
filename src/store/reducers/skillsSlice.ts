import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { ISkills } from "./interfaces";

const initialState: ISkills = {
  skills: "",
};

export const SkillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    setSkills(state, action) {
      return action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const { setSkills, reset } = SkillsSlice.actions;

export const getSkills = (state: RootState) => state.SkillsReducer;

export default SkillsSlice.reducer;
