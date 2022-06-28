import { atom, selector } from "recoil";

//Post type state
export const moderatorState = atom({
    key: "listModerators",
    default: [],
  });