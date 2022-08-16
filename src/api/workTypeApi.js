import axiosClient from "./axiosClient";

const workTypeApi = {
 // [Admin] Endpoint for get all worktypes with condition
 getAll: (params) => {
    const url = '/worktype';
    return axiosClient.get(url, { params });
  },

  // [Admin] Endpoint for update worktype.
  put: (worktype) => {
    return axiosClient.put(`/worktype`, worktype);
  },

  // [Admin] Endpoint for create worktype
  post: (worktype) => {
    return axiosClient.post(`/worktype`, worktype);
  },

  // [Admin] Endpoint for Admin Deactivation a worktype
  delete: (id) => {
    return axiosClient.delete(`/worktype/${id}`);
  },
}

export default workTypeApi;