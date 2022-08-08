import { atom, selector } from "recoil";

//Account state
export const accountState = atom({
    key: "listAccounts",
    default: [],
  });

  export const accountToggleState = atom({
    key: "accountToggle",
    default: [],
  });


