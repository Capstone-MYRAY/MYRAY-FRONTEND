import axiosClient from "./axiosClient";
import {roleId} from "variables/general";

const accountApi = {
  // [Moderators] Endpoint for get accounts
 getAll: (params) => {
  const url = '/account';
  return axiosClient.get(url, { params });
},

// [Moderator] Endpoint for get account by ID
get: (accountId) => {
  const url = `/account/${accountId}`;
  return axiosClient.get(url);
},

// [Moderator] Endpoint for account
put: (account) => {
  return axiosClient.put(`/account`, account);
},


 // [Moderator] Endpoint for top up account
 topUp: (account) => {
  // const params = {
  //   accountId: account.accountId,
  //   topUp: account.topUp
  // }
  const accountId = account.accountI;
  const topUp = account.topUp;
  return axiosClient.post(`/account/topup?accountId=${account.accountId}&topUp=${account.topUp}`
  );
},

}

export default accountApi;