import axiosClient from './axiosClient';

const authApi = {
    authen:  (loginInput) => {
//         const headers = { 
//             'token': token,
//         };
        return axiosClient.post(`/authentication/login`, loginInput);
    }
}

export default authApi;