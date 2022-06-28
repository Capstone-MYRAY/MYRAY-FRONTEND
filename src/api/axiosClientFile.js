import axios from 'axios';
import queryString from 'query-string';

// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const axiosClientFile = axios.create({
  baseURL: "https://api.myray.site/upload",
  // baseURL: baseAURL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

// axiosClientFile.interceptors.request.use(async (config) => {
//   const token = JSON.parse(localStorage.getItem('user'));
//   console.log('[AXIOS] Logged in user token: ', token);
//   if (token) {
//     config.headers.Authorization = `Bearer ${token.token}`;
//   }

//   return config;
// });

axiosClientFile.interceptors.response.use((response) => {
  if (response && response.data) {
    return response;
  }

  return response;
}, (error) => {
  // Handle errors
  throw error;
});

export default axiosClientFile;