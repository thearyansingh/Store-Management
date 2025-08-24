import api from './axios'

export const me = () => api.get('/auth/me')
export const login = (email, password) => api.post('/auth/login', { email, password })
export const logout = () => api.post('/auth/logout')
export const register = (payload) => api.post('/auth/register', payload)
export const changePassword = (payload) => api.put('/auth/change-password', payload)
