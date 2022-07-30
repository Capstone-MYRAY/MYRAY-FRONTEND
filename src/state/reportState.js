import { atom, selector } from "recoil";

//Tree type state
export const reportState = atom({
    key: "listReport",
    default: [],
  });