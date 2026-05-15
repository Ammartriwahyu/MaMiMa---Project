import { get, post } from '@/lib/apiClient'

export const bookmarksApi = {
  getAll:  () => get('/bookmarks'),
  toggle:  (placeId) => post(`/places/${placeId}/bookmark`),
}
