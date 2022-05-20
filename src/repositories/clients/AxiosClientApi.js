import axios from 'axios';

const baseDomain = `${REACT_APP_API_URL}`;
const baseURL = baseDomain + '/api/v1';

const axiosApiInstance = axios.create({
  baseURL,
});

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  function (config) {
    config.headers = {
      Authorization: `Bearer ${localStorage.getItem('user_token')}`,
      Accept: 'application/json',
    };
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

// Response interceptor for API calls
// axiosApiInstance.interceptors.response.use((response) => {
//   return response
// }, async function (error) {
//   const originalRequest = error.config;
//     console.log('estoy iniciando',error);

//   if (error.response.status === 403 && !originalRequest._retry) {
//     originalRequest._retry = true;
//     const {data} = await axiosApiInstance.post(this.$apiAdress + '/api/v1/refresh');
//     axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
//     axios.defaults.headers.common['Accept'] = 'application/json';

//     localStorage.setItem("api_token", data.access_token);
//     localStorage.setItem('roles', data.roles);

//     return axiosApiInstance(originalRequest);
//   }

//   return Promise.reject(error);
// });

export default axiosApiInstance;
