import axios from 'axios';
import queryString from 'query-string';
import firebase from 'firebase';
import authApi from './authApi';
import { baseAURL } from 'variables/general';

const getFirebaseToken = async () => {
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    try {
      const firebaseToken = currentUser.getIdToken();
      console.log(" TOKEN: ", firebaseToken);
      const response = await authApi.authen(firebaseToken);
      console.log("BACK-END TOKEN: ", response.config.data);
      return response;
    } catch (err) {
      console.log("Failed to get Firebase Token. ", err);
    }
  }

  // Not logged in
  const hasRememberedAccount = localStorage.getItem('firebaseui::rememberedAccounts');
  if (!hasRememberedAccount) return null;

  // Logged in but current user is not fetched --> wait (10s)
  return new Promise((resolve, reject) => {
    const waitTimer = setTimeout(() => {
      reject(null);
      console.log('Reject timeout');
    }, 10000);

    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        reject(null);
      }

      const token = await user.getIdToken();
      console.log('[AXIOS] Logged in user token: ', token);
      resolve(token);

      unregisterAuthObserver();
      clearTimeout(waitTimer);
    });
  });
}

// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#request- config` for the full list of configs
const axiosClient = axios.create({
  baseURL: "http://api.myray.site/api/v1",
  // baseURL: baseAURL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  const token = JSON.parse(localStorage.getItem('user'));
  console.log('[AXIOS] Logged in user token: ', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token.token}`;
  }

  return config;
});

axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    return response;
  }

  return response;
}, (error) => {
  // Handle errors
  throw error;
});

export default axiosClient;