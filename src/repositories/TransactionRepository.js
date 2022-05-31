import backend from './clients/AxiosClientApi';

const api = {
  get(params) {
    return backend.get(`transactions`, { params });
  },
  getBusinessObject(id) {
    return backend.get(`transactions/${id}`);
  },
  store(payload) {
    return backend.post(`transactions`, payload);
  },
  update(payload) {
    return backend.put(`transactions/${payload._id}`, payload);
  },
  delete(id) {
    return backend.delete(`transactions/${id}`);
  },
};

export default api;
