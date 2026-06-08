import { api } from './api.js';

export const courseService = {
    getAll:   (params = {}) => api.get('/courses?' + new URLSearchParams(params).toString()),
    getById:  (id)          => api.get(`/courses/${id}`),
    create:   (data)        => api.post('/courses', data),
    update:   (id, data)    => api.put(`/courses/${id}`, data),
    delete:   (id)          => api.delete(`/courses/${id}`),
    getStats: ()            => api.get('/courses/stats'),
};
