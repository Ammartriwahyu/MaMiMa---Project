import { useState, useEffect, useCallback } from 'react'
import { placesApi } from '../api/placesApi'

export function usePlaces(filters = {}) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetchPlaces = useCallback(async (params) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await placesApi.getAll(params || filters)
      setPlaces(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line

  useEffect(() => { fetchPlaces(filters) }, []) // eslint-disable-line

  return { places, loading, error, refresh: fetchPlaces, setPlaces }
}

export function usePlace(id) {
  const [place, setPlace]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const { data } = await placesApi.getOne(id)
      setPlace(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetch() }, [fetch])

  return { place, setPlace, loading, error, refresh: fetch }
}
