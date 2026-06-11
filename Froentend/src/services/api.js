const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(method, path, data) {
    const token = localStorage.getItem('erp_token');

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    };

    if (data) config.body = JSON.stringify(data);

    const res = await fetch(`${BASE_URL}${path}`, config);

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        // Session expired or invalid — clear auth and redirect to login
        if (res.status === 401) {
            localStorage.removeItem('erp_token');
            localStorage.removeItem('erp_user');
            localStorage.removeItem('erp_auth_source');
            window.location.href = '/login';
        }
        throw new Error(err.message || 'Something went wrong');
    }

    return res.json();
}

export const api = {
    get:    (path)       => request('GET',    path),
    post:   (path, data) => request('POST',   path, data),
    put:    (path, data) => request('PUT',    path, data),
    patch:  (path, data) => request('PATCH',  path, data),
    delete: (path)       => request('DELETE', path),
};
