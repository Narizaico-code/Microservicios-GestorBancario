import { axiosAccount } from './api'

export const getFavorites = async () => {
  return await axiosAccount.get('/favorites')
}

export const addFavorite = async (payload) => {
  return await axiosAccount.post('/favorites', payload)
}

export const deleteFavorite = async (id) => {
  return await axiosAccount.delete(`/favorites/${id}`)
}
