import axios from 'axios';

// const config = dotenv.config();

const baseDomain = `${REACT_APP_API_URL}`;
const baseURL= baseDomain + '/api/v1/auth'

const axiosInstance = axios.create({
baseURL
});

const api = {
  login(params) {
    return axiosInstance.post(`login`, params);
  },
  changePassword(params) {
    return axiosInstance.get(`change-pasword`, { params });
  },
  verifyEmail(params) {
    return axiosInstance.post(`verify-email`, { params });
  },
};

export default api;
