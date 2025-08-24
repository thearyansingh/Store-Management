import api from './axios'

export const listPublicStores = (params) => api.get('/stores', { params })
// optional userId param comes from context.user?.id
export const getStoreDetails = (id, params) => api.get(`/stores/${id}`, { params })
export const rateStore = (storeId, rating) => api.post(`/stores/${storeId}/rate`, { rating })
