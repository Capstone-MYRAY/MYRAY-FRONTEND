import axiosClient from "./axiosClient";

const guidePostApi = {
 // [Admin] Endpoint for get all guideposts with condition
 getAll: (params) => {
    const url = '/guidepost';
    return axiosClient.get(url, { params });
  },

}

export default guidePostApi;