import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IResumeDetails } from "./interfaces";

const initialState: IResumeDetails = {
  nickname: "",
  _id: undefined,
  completed: false,
  creatingNewResume: false,
};

export const ResumeDetailsSlice = createSlice({
  name: "resumeDetails",
  initialState,
  reducers: {
    setResumeDetails(state, action) {
      return action.payload;
    },
    setCreatingNewResume(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        creatingNewResume: action.payload,
      };
    },
    setResumeNickname(state, action: PayloadAction<string>) {
      return {
        ...state,
        nickname: action.payload,
      };
    },
    reset() {
      return initialState;
    },
  },
});

export const {
  setResumeDetails,
  reset,
  setResumeNickname,
  setCreatingNewResume,
} = ResumeDetailsSlice.actions;

export const getResumeDetails = (state: RootState) =>
  state.ResumeDetailsReducer;

export default ResumeDetailsSlice.reducer;
