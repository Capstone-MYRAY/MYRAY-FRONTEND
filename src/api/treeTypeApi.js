import axiosClient from "./axiosClient";

const treeTypeApi = {
 // [Admin] Endpoint for get all tree types with condition
 getAll: (params) => {
    const url = '/TreeType';
    return axiosClient.get(url, { params });
  },

}

export default treeTypeApi;