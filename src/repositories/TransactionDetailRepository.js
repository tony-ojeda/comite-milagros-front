import backend from './clients/AxiosClientApi';

const api = {
  get(params) {
    return backend.get(`transaction-details`, { params });
  },
  getBusinessObject(id) {
    return backend.get(`transaction-details/${id}`);
  },
  store(payload) {
    return backend.post(`transaction-details`, payload);
  },
  update(payload) {
    return backend.put(`transaction-details/${payload._id}`, payload);
  },
  delete(id) {
    return backend.delete(`transaction-details/${id}`);
  },
};

export default api;
