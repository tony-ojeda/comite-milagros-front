import backend from './clients/AxiosClientApi';

const api = {
  get(params) {
    return backend.get(`vehicles`, { params });
  },
  getBusinessObject(id) {
    return backend.get(`vehicles/${id}`);
  },
  store(payload) {
    return backend.post(`vehicles`, payload);
  },
  update(payload) {
    return backend.put(`vehicles/${payload.id}`, payload);
  },
  delete(id) {
    return backend.delete(`vehicles/${id}`);
  },
};

export default api;
