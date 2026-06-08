import { api } from './api.js';

export const teacherService = {
    getAll:   (params = {}) => api.get('/teachers?' + new URLSearchParams(params).toString()),
    getById:  (id)          => api.get(`/teachers/${id}`),
    create:   (data)        => api.post('/teachers', data),
    update:   (id, data)    => api.put(`/teachers/${id}`, data),
    delete:   (id)          => api.delete(`/teachers/${id}`),
    getStats: ()            => api.get('/teachers/stats'),
};
