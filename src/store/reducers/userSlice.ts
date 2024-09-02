import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IUser } from "./interfaces";
import { USER_ID } from "../../app.constants";

const initialState: IUser = {
  userId: USER_ID,
  createdAt: -1,
  lastUpdatedAt: -1,
};

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    resetUser() {
      return initialState;
    },
  },
});

export const { setUser, resetUser } = UserSlice.actions;

export const getUser = (state: RootState) => state.UserReducer;
export const getUserId = (state: RootState) => state.UserReducer.userId;

export default UserSlice.reducer;
