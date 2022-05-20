import backend from './clients/AxiosClientApi';

const api = {
  uploadFile(payload) {
    return backend.post(`uploads/file`, payload);
  },
  uploadFiles(payload) {
    return backend.post(`uploads/files`, payload);
  },
  // update(payload) {
  //   return backend.put(`users/${payload.id}`, payload);
  // },
  // delete(id) {
  //   return backend.delete(`users/${id}`);
  // },
};

export default api;
