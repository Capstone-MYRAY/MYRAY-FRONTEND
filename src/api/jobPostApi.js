import axiosClient from "./axiosClient";

const jobPostApi = {
  // [Moderator] Endpoint for get all JobPost with condition
  getAll: (params) => {
    const url = "/jobpost";
    return axiosClient.get(url, { params });
  },
  // [Moderator] Endpoint for get JobPost by ID
  get: (id) => {
    const url = `/jobpost/${id}`;
    return axiosClient.get(url);
  },

  // [Moderator] Endpoint for approve JobPost.
  patchApproveJob: (jobPostId) => {
    return axiosClient.patch(`/jobpost/approvejob/${jobPostId}`);
  },

  // [Moderator] Endpoint for reject JobPost
  patchRejectJob: (params) => {
    return axiosClient.patch(`/jobpost/rejectjob`, params );
  },

  //config
  // [Admin] Endpoint for get config
  getConfig: () => {
    return axiosClient.get(`/config`);
  },

  // [Admin] Endpoint for update config
  patchConfig: (params) => {
    return axiosClient.patch(`/config?key=${params.key}&value=${params.value}`);
  },

};

export default jobPostApi;
