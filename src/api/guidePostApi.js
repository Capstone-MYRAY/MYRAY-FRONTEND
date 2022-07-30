import axiosClient from "./axiosClient";

const guidePostApi = {
 // [Admin] Endpoint for get all guideposts with condition
 getAll: (params) => {
    const url = '/guidepost';
    return axiosClient.get(url, { params });
  },

  // [Admin] Endpoint for create guidepost
  post: (guidepost) => {
    return axiosClient.post(`/guidepost`, guidepost);
  },

  // [Admin] Endpoint for update guidepost
  put: (guidepost) => {
    return axiosClient.put(`/guidepost`, guidepost);
  },

  // [Admin] Endpoint for Admin Deactivation a guidepost
  delete: (guidepostId) => {
    return axiosClient.delete(`/guidepost/${guidepostId}`);
  },
}

export default guidePostApi;