import { atom, selector } from "recoil";

//Tree type state
export const jobPostState = atom({
    key: "listJobPost",
    default: [],
  });