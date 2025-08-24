import api from './axios'

export const getDashboard = () => api.get('/admin/dashboard')

export const createUser = (payload) => api.post('/admin/users', payload)
export const listUsers = (params) => api.get('/admin/users', { params })
export const getUser = (id) => api.get(`/admin/users/${id}`)

export const createStore = (payload) => api.post('/admin/stores', payload)
export const listStores = (params) => api.get('/admin/stores', { params })
