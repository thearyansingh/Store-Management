import api from './axios'

export const getOwnerRatings = () => api.get('/stores/:storeId/ratings')
export const getOwnerStores = () => api.get('/owner/stores')

