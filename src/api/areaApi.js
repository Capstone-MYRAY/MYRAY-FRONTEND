import axiosClient from "./axiosClient";
import axiosClientFile from "./axiosClientFile";
import axios from "axios";

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
  post: (area) => {
    return axiosClient.post(`/area`, area);
  },

    // [Admin] Endpoint for moderator or Admin edit area.
    put: (area) => {
      return axiosClient.put(`/area`, area);
    },

  // [Admin] Endpoint for Admin Deactivation an area.
  delete: (id) => {
    return axiosClient.delete(`/area/${id}`);
  },

  getProvince: () => { 
    return axiosClientFile.get(`https://api.myray.site/upload/tinhthanh.json`);
  },

  getDistrict: () => { 
    return axiosClientFile.get(`https://api.myray.site/upload/quanhuyen.json`);
  },

  getCommune: () => { 
    return axiosClientFile.get(`http://api.myray.site/upload/phuongxa.json`);
  },

}

export default areaApi;