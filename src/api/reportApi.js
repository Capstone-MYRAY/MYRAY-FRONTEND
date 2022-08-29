import axiosClient from "./axiosClient";

const reportApi = {
    // [Admin] Endpoint for get all report  with condition
    getAll: (filters) => {
      let params =  filters.params;
       const url = `/report/area/${filters.areaId}`;
       return axiosClient.get(url, { params});
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