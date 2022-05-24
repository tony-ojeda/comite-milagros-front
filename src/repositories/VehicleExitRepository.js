import backend from './clients/AxiosClientApi';

const api = {
  get(params) {
    return backend.get(`vehicleExits`, { params });
  },
  getBusinessObject(id) {
    return backend.get(`vehicleExits/${id}`);
  },
  store(payload) {
    return backend.post(`vehicleExits`, payload);
  },
  update(payload) {
    return backend.put(`vehicleExits/${payload._id}`, payload);
  },
  delete(id) {
    return backend.delete(`vehicleExits/${id}`);
  },
};

export default api;
