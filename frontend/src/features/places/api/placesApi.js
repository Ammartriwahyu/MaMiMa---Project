import { get, post, put, del, buildFormData } from '@/lib/apiClient'

export const placesApi = {
  getAll: (params = {}) => {
    const q = new URLSearchParams()
    if (params.search) q.set('search', params.search)
    if (params.lokasi) q.set('lokasi', params.lokasi)
    if (params.category) q.set('category', params.category)
    if (params.type) (Array.isArray(params.type) ? params.type : [params.type]).forEach(t => q.append('type[]', t))
    return get(`/places?${q}`)
  },
  getOne: (id) => get(`/places/${id}`),
  create: (data) => post('/places', buildFormData(data)),
  update: (id, data) => put(`/places/${id}`, buildFormData(data)),
  delete: (id) => del(`/places/${id}`),
  getMenus: (id) => get(`/places/${id}/menus`),
  addMenu: (id, data) => post(`/places/${id}/menus`, buildFormData(data)),
  updateMenu: (menuId, data) => put(`/menus/${menuId}`, buildFormData(data)),
  deleteMenu: (menuId) => del(`/menus/${menuId}`),
}