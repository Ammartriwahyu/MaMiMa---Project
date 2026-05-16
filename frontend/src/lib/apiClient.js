// Central API client — all requests go through here
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function getToken() {
  return localStorage.getItem('mamima_token')
}

function buildHeaders(isFormData = false) {
  const h = { Accept: 'application/json' }
  const token = getToken()
  if (token) h['Authorization'] = `Bearer ${token}`
  if (!isFormData) h['Content-Type'] = 'application/json'
  return h
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg =
      data?.message ||
      Object.values(data?.errors || {})?.[0]?.[0] ||
      `Error ${res.status}`
    throw new Error(msg)
  }
  return data
}

export async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers: buildHeaders() })
  return handleResponse(res)
}

export async function post(path, body, method = 'POST') {
  const isFormData = body instanceof FormData
  const res = await fetch(`${BASE_URL}${path}`, {
    method: method,
    headers: buildHeaders(isFormData),
    body: isFormData ? body : JSON.stringify(body),
  })
  return handleResponse(res)
}

export async function put(path, body) {
  return post(path, body, 'PUT')
}

export async function del(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  })
  return handleResponse(res)
}

// Helper: build FormData and append _method=PUT for Laravel
export function buildFormData(data, method = 'POST') {
  const fd = new FormData()
  // Jangan append _method, gunakan PUT langsung via fetch
  for (const [key, val] of Object.entries(data)) {
    if (val === null || val === undefined) continue
    if (Array.isArray(val)) {
      val.forEach(item => fd.append(`${key}[]`, item))
    } else if (val instanceof File || val instanceof Blob) {
      fd.append(key, val)
    } else {
      fd.append(key, val)
    }
  }
  return fd
}
