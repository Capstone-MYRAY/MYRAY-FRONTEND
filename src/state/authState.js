import { atom } from "recoil";

export const authState = atom({
    key: "authUser",
    default: {},
  });

  export const addUserAuth = (user, userAuth) => {
    user = userAuth;
    return user;
  }