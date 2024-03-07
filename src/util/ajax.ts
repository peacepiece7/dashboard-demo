import axios from "axios";

const ajax = axios.create({
    baseURL: "https://sportsclub-api-dev.sports.or.kr/support",
    timeout: 15000
});

ajax.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

ajax.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        console.log(error.config);
        return Promise.reject(error);
    }
);

export default ajax;
