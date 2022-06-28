import axiosClient from "./axiosClient";

const treeTypeApi = {
 // [Admin] Endpoint for get all tree types with condition
 getAll: (params) => {
    const url = '/treetype';
    return axiosClient.get(url, { params });
  },

  // [Admin] Endpoint for update tree type.
  put: (treetype) => {
    return axiosClient.put(`/treetype`, treetype);
  },

  // [Admin] Endpoint for create tree type
  post: (treetype) => {
    return axiosClient.post(`/treetype`, treetype);
  },

  // [Admin] Endpoint for Admin Deactivation a tree type
  delete: (id) => {
    return axiosClient.delete(`/treetype/${id}`);
  },
}

export default treeTypeApi;