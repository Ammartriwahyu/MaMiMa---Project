import { get, post, buildFormData } from '@/lib/apiClient'

export const profileApi = {
  getProfile:  (username) => get(`/users/${username}`),
  getPlaces:   (username) => get(`/users/${username}/places`),
  update: (username, data) => post(`/users/${username}`, buildFormData(data, 'PUT')),
}
