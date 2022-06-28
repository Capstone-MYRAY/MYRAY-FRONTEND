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
  patchApproveJob: (id) => {
    return axiosClient.patch(`/jobpost/approvejob/${id}`);
  },

  // [Moderator] Endpoint for reject JobPost
  patchRejectJob: (id) => {
    return axiosClient.patch(`/jobpost/rejectjob/${id}`);
  },

};

export default jobPostApi;
