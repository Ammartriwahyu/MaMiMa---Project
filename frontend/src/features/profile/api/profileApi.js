import { get, put, buildFormData } from '@/lib/apiClient'

export const profileApi = {
  getProfile: (username) => get(`/users/${username}`),
  getPlaces: (username) => get(`/users/${username}/places`),
  update: (username, formData) => put(`/users/${username}`, formData),
}