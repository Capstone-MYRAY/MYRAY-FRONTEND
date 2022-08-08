import axiosClient from "./axiosClient";

const authApi = {
  authen: (loginInput) => {
    return axiosClient.post(`/authentication/login`, loginInput);
  },

  resetpassword: (phoneNumber) => {
    return axiosClient.post(`/authentication/resetpassword?phoneNumber=${phoneNumber}`);
  },
};

export default authApi;
