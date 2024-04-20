import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IAboutMe } from "./interfaces";

const initialState: IAboutMe = {
  aboutMe: "",
};

export const AboutMeSlice = createSlice({
  name: "aboutMe",
  initialState,
  reducers: {
    setAboutMe(state, action) {
      return action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const { setAboutMe, reset } = AboutMeSlice.actions;

export const getAboutMe = (state: RootState) => state.AboutMeReducer;

export default AboutMeSlice.reducer;
