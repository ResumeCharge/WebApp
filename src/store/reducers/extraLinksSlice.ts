import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { IExtraLink } from "./interfaces";

const initialState: Array<IExtraLink> = [];

export const ExtraLinksSlice = createSlice({
  name: "extraLinks",
  initialState,
  reducers: {
    addExtraLink: {
      reducer(state, action: PayloadAction<IExtraLink>) {
        state.push(action.payload);
      },
      prepare(payload: { linkName: string; linkValue: string }) {
        const id = nanoid();
        return {
          payload: {
            ...payload,
            id,
          },
        };
      },
    },
    removeLink(state, action: PayloadAction<string>) {
      return state.filter((link) => {
        return link.id !== action.payload;
      });
    },
    updateLink(state, action: PayloadAction<IExtraLink>) {
      const indexOfExtraLink = state.findIndex(
        (extraLink) => extraLink.id === action.payload.id
      );
      state[indexOfExtraLink].linkName = action.payload.linkName;
      state[indexOfExtraLink].linkValue = action.payload.linkValue;
      return state;
    },
    setExtraLinks(_, action: PayloadAction<Array<IExtraLink>>) {
      action.payload.forEach((link, index) => {
        link.id = nanoid();
      });
      return action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const { addExtraLink, removeLink, updateLink, setExtraLinks, reset } =
  ExtraLinksSlice.actions;

export const getExtraLinks = (state: RootState) => state.ExtraLinksReducer;

export default ExtraLinksSlice.reducer;
