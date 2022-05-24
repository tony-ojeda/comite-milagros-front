import backend from './clients/AxiosClientApi';

const api = {
  get(params) {
    return backend.get(`services`, { params });
  },
  getBusinessObject(id) {
    return backend.get(`services/${id}`);
  },
  store(payload) {
    return backend.post(`services`, payload);
  },
  update(payload) {
    return backend.put(`services/${payload._id}`, payload);
  },
  delete(id) {
    return backend.delete(`services/${id}`);
  },
};

export default api;
