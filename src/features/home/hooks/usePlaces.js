import { useState, useEffect, useCallback } from 'react'
import { dummyPlaces } from '../data/dummyPlaces'

const PLACES_KEY = 'mamima_places'

function loadPlaces() {
  try {
    const stored = localStorage.getItem(PLACES_KEY)
    if (stored) return JSON.parse(stored)
    localStorage.setItem(PLACES_KEY, JSON.stringify(dummyPlaces))
    return dummyPlaces
  } catch {
    return dummyPlaces
  }
}

function savePlaces(places) {
  localStorage.setItem(PLACES_KEY, JSON.stringify(places))
}

export function usePlaces() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPlaces(loadPlaces())
    setLoading(false)
  }, [])

  const refresh = useCallback(() => {
    setPlaces(loadPlaces())
  }, [])

  const addPlace = useCallback((newPlace) => {
    const all = loadPlaces()
    const toAdd = {
      ...newPlace,
      id: `p${Date.now()}`,
      rating: 0,
      reviewCount: 0,
      likes: 0,
      saves: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    const updated = [toAdd, ...all]
    savePlaces(updated)
    setPlaces(updated)
    return toAdd
  }, [])

  const updatePlace = useCallback((id, updates) => {
    const all = loadPlaces()
    const updated = all.map(p => p.id === id ? { ...p, ...updates } : p)
    savePlaces(updated)
    setPlaces(updated)
  }, [])

  const deletePlace = useCallback((id) => {
    const all = loadPlaces()
    const updated = all.filter(p => p.id !== id)
    savePlaces(updated)
    setPlaces(updated)
  }, [])

  const getById = useCallback((id) => {
    return loadPlaces().find(p => p.id === id)
  }, [])

  const getByUser = useCallback((userId) => {
    return loadPlaces().filter(p => p.userId === userId)
  }, [])

  return { places, loading, addPlace, updatePlace, deletePlace, getById, getByUser, refresh }
}
