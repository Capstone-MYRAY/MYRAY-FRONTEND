import axiosClient from "./axiosClient";

const statisticApi = {
    // [Admin] Endpoint for get 
    getStatistic: () => {
       const url = `/statistic`;
       return axiosClient.get(url);
     },

    getChartData: (year) => {
      const url = `/statistic/year?year=${year}`;
      return axiosClient.get(url);
    },

   }
   
   export default statisticApi;