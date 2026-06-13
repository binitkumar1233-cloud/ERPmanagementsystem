import { auth } from '../config/firebase.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let _refreshing = false;

/* Try to exchange a Firebase token for a backend JWT, return new token or null */
async function tryExchangeFirebaseToken() {
    if (_refreshing) return null;
    _refreshing = true;
    try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return null;

        const res = await fetch(`${BASE_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid:   firebaseUser.uid,
                name:  firebaseUser.displayName,
                email: firebaseUser.email,
                photo: firebaseUser.photoURL,
            }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        localStorage.setItem('erp_token', data.token);
        localStorage.setItem('erp_auth_source', 'backend');
        // Update stored user with fresh backend data
        if (data.data) localStorage.setItem('erp_user', JSON.stringify(data.data));
        return data.token;
    } catch {
        return null;
    } finally {
        _refreshing = false;
    }
}

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

    let res;
    try {
        res = await fetch(`${BASE_URL}${path}`, config);
    } catch (_networkErr) {
        throw new Error('Cannot connect to server. Make sure the backend is running (npm run dev inside /Backend).');
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText || `HTTP ${res.status}` }));

        if (res.status === 401) {
            const authSource = localStorage.getItem('erp_auth_source');

            // If the stored token is a Firebase token, try upgrading to backend JWT first
            if (authSource === 'firebase') {
                const newToken = await tryExchangeFirebaseToken();
                if (newToken) {
                    // Retry original request with the new backend JWT
                    config.headers.Authorization = `Bearer ${newToken}`;
                    const retry = await fetch(`${BASE_URL}${path}`, config);
                    if (retry.ok) return retry.json();
                }
            }

            // Could not refresh — clear session and redirect
            localStorage.removeItem('erp_token');
            localStorage.removeItem('erp_user');
            localStorage.removeItem('erp_auth_source');
            window.location.href = '/login';
            return new Promise(() => {}); // navigation in progress, never resolve
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
