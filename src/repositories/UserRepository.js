import backend from './clients/AxiosClientApi';

const api = {
  get(params) {
    return backend.get(`users`, { params });
  },
  currentUser(params) {
    return backend.get(`users/current-user`, { params });
  },
  getBlog(id) {
    return backend.get(`users/${id}`);
  },
  store(payload) {
    return backend.post(`users`, payload);
  },
  update(payload) {
    return backend.put(`users/${payload._id}`, payload);
  },
  delete(id) {
    return backend.delete(`users/${id}`);
  },
};

export default api;
