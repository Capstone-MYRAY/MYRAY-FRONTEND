import axiosClient from "./axiosClient";
import axiosClientFile from "./axiosClientFile";

const areaApi = {
  // [Admin] Endpoint for get all areas with condition
  getAll: (params) => {
    const url = '/area';
    return axiosClient.get(url, { params });
  },

  // [Admin] Endpoint for get alumni by ID
  get: (id) => {
    const url = `/alumnus/${id}`;
    return axiosClient.get(url);
  },
  
  // [Admin] Endpoint for Alumni or Admin edit profile.
  put: (alumnus) => {
    return axiosClient.put(`/alumnus`, alumnus);
  },

  // [Admin] Endpoint for Admin Deactivation a alumni.
  delete: (id) => {
    return axiosClient.delete(`/alumnus/${id}`);
  },

  // [Admin] Endpoint to activate or reject Alumni.
  patch: (id, status) => {
    return axiosClient.patch(`alumnus/activate?id=${id}&status=${status}`);
  },

  getProvince: () => { 
    return axiosClientFile.get(`/quanhuyen.json`);
  }

}

export default areaApi;