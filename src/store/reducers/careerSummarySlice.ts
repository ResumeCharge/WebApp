import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { ICareerSummary } from "./interfaces";

const initialState: ICareerSummary = {
  summary: "",
};

export const CareerSummarySlice = createSlice({
  name: "careerSummary",
  initialState,
  reducers: {
    setCareerSummary(state, action) {
      return action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const { setCareerSummary, reset } = CareerSummarySlice.actions;

export const getCareerSummary = (state: RootState) =>
  state.CareerSummaryReducer;

export default CareerSummarySlice.reducer;
