import axiosClient from "./axiosClient";

const treeTypeApi = {
 // [Admin] Endpoint for get all post types with condition
 getAll: (params) => {
    const url = '/posttype';
    return axiosClient.get(url, { params });
  },

  // [Admin] Endpoint for update post type.
  put: (posttype) => {
    return axiosClient.put(`/posttype`, posttype);
  },

  // [Admin] Endpoint for create post type
  post: (posttype) => {
    return axiosClient.post(`/posttype`, posttype);
  },

  // [Admin] Endpoint for Admin Deactivation a post type
  delete: (id) => {
    return axiosClient.delete(`/posttype/${id}`);
  },
}

export default treeTypeApi;