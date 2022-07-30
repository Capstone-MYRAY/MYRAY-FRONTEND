import axiosClient from "./axiosClient";

const reportApi = {
    // [Admin] Endpoint for get all report  with condition
    getAll: (params) => {
       const url = '/report';
       return axiosClient.get(url, { params });
     },
   
     // [Admin] Endpoint for update report.
     resolve: (report) => {
       return axiosClient.put(`/report/resolve`, report);
     },
   
     // [Admin] Endpoint for Admin Deactivation a report
     delete: (reportId) => {
       return axiosClient.delete(`/report/${reportId}`);
     },
   }
   
   export default reportApi;