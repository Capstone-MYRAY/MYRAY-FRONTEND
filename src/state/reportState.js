import { atom, selector } from "recoil";

export const reportState = atom({
    key: "listReport",
    default: [],
  });

  export const accountReportedState = atom({
    key: "accountReported",
    default: {},
  });
