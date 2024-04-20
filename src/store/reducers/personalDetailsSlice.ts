import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { ILanguage, IPersonalDetails } from "./interfaces";

const initialState: IPersonalDetails = {
  firstName: "",
  lastName: "",
  avatar: "",
  email: "",
  phone: "",
  website: "",
  linkedin: "",
  github: "",
  languages: [],
};

export const PersonalDetailsSlice = createSlice({
  name: "personalInformation",
  initialState,
  reducers: {
    setPersonalInformation(state, action: PayloadAction<IPersonalDetails>) {
      return action.payload;
    },
    addLanguage: {
      reducer(state, action: PayloadAction<ILanguage>) {
        state.languages.push(action.payload);
      },
      prepare(payload: { name: string; proficiency: string }) {
        const id = nanoid();
        return {
          payload: {
            ...payload,
            id,
          },
        };
      },
    },
    removeLanguage(state, action: PayloadAction<string>) {
      return {
        ...state,
        languages: state.languages.filter(
          (language) => language.id !== action.payload
        ),
      };
    },
    reset() {
      return initialState;
    },
  },
});

export const { setPersonalInformation, addLanguage, removeLanguage, reset } =
  PersonalDetailsSlice.actions;

export const getPersonalInformation = (state: RootState) =>
  state.PersonalInformationReducer;

export const getLanguages = (state: RootState) =>
  state.PersonalInformationReducer.languages;

export default PersonalDetailsSlice.reducer;
