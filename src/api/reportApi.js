import axiosClient from "./axiosClient";

const reportApi = {
    // [Admin] Endpoint for get all report  with condition
    getAll: (filters) => {
      let params =  filters.params;
       return axiosClient.get(`/report/area/${filters.areaId}`, { params });
     },

    getByReportedID: (filters) => {
      let params =  filters.params;
       return axiosClient.get(`/report/reported/${filters.reportedId}`, { params });
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