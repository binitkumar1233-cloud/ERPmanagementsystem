import { api } from './api.js';

export const studentService = {
    getAll:   (params = {}) => api.get('/students?' + new URLSearchParams(params).toString()),
    getById:  (id)          => api.get(`/students/${id}`),
    create:   (data)        => api.post('/students', data),
    update:   (id, data)    => api.put(`/students/${id}`, data),
    delete:   (id)          => api.delete(`/students/${id}`),
    search:   (q)           => api.get(`/students/search?q=${encodeURIComponent(q)}`),
    getStats: ()            => api.get('/students/stats'),
};
