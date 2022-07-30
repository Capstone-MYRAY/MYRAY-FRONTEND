import { atom, selector } from "recoil";

//Post type state
export const listGuidePostState = atom({
    key: "listGuidePostTypes",
    default: [],
  });

  export const guidepostContentState = atom({
    key: "guidePostContent",
    default: "",
  });