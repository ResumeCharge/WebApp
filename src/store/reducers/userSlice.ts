import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IUser } from "./interfaces";

const initialState: IUser = {
  isSignedIn: false,
  userId: "",
  createdAt: -1,
  lastUpdatedAt: -1,
  email: "",
  websiteIdentifier: null,
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
    setIsUserSignedIn(state, action) {
      return {
        ...state,
        isSignedIn: action.payload,
      };
    },
  },
});

export const { setUser, resetUser, setIsUserSignedIn } = UserSlice.actions;

export const getUser = (state: RootState) => state.UserReducer;
export const getUserId = (state: RootState) => state.UserReducer.userId;

export default UserSlice.reducer;
