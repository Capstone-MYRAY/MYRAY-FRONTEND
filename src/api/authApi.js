import axiosClient from './axiosClient';

const authApi = {
    authen:  (loginInput) => {
//         const headers = { 
//             'token': token,
//         };
        return axiosClient.post(`/Authentication/login`, loginInput);
    }
}

export default authApi;