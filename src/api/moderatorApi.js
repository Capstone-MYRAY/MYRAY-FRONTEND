import axiosClient from "./axiosClient";
import {roleId} from "variables/general";

const moderatorApi = {
 // [Admin] Endpoint for get moderator nomanage with condition
 getModeratorNoManage: (params) => {
    const url = '/account/getmoderatornomanage';
    return axiosClient.get(url, { params });
  },

  // [Admin] Endpoint for get moderator nomanage with condition
 getAll: (params) => {
  const url = '/account';
  params = {...params, roleId: roleId.moderator }
  return axiosClient.get(url, { params });
},

  // [Admin] Endpoint for moderator or Admin edit profile.
  put: (moderator) => {
    return axiosClient.put(`/account`, moderator);
  },

 // [Admin] Endpoint for Admin Deactivation a moderator.
 delete: (accountId) => {
  return axiosClient.delete(`/account/ban/${accountId}`);
},

 // [Admin] Endpoint for create moderator
 post: (moderator) => {
  return axiosClient.post(`/account`, moderator);
},

}

export default moderatorApi;