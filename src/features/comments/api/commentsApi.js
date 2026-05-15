import { get, post, del } from '@/lib/apiClient'

export const commentsApi = {
  getAll: (placeId) => get(`/places/${placeId}/comments`),
  create: (placeId, content) => post(`/places/${placeId}/comments`, { content }),
  delete: (commentId) => del(`/comments/${commentId}`),
}
