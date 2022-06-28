import axiosClient from "./axiosClient";

const postTypeApi = {
 // [Admin] Endpoint for get all post types with condition
 getAll: (params) => {
    const url = '/PostType';
    return axiosClient.get(url, { params });
  },

}

export default postTypeApi;