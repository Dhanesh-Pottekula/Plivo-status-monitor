import axios from "axios";
import { envDefaults } from "../../envDefaults";
const baseURL = envDefaults.nodeApiUrl;
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
// axios.defaults.xsrfCookieName = "csrftoken";
const axiosNodeInstance = axios.create({
    baseURL: baseURL
});

axiosNodeInstance.interceptors.request.use(
    function (config) {
        
        
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosNodeInstance.interceptors.response.use(
    (response) => {
        if (response.status === 401) {
            alert("You are not authorized");
            
        }
        return response;
    },
    (error) => {
        if (
            error?.response?.status === 401
        ) {
            // logoutUserHelper()
            return Promise.reject(error.response && error.response.data);
        }
        return Promise.reject(error.response.data);
    }
);
export default axiosNodeInstance;