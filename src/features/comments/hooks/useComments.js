import { useState, useEffect, useCallback } from 'react'
import { commentsApi } from '../api/commentsApi'

export function useComments(placeId, pollInterval = 8000) {
  const [comments, setComments] = useState([])
  const [loading, setLoading]   = useState(true)

  const fetch = useCallback(async () => {
    if (!placeId) return
    try {
      const { data } = await commentsApi.getAll(placeId)
      setComments(data)
    } catch {}
    finally { setLoading(false) }
  }, [placeId])

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, pollInterval)
    return () => clearInterval(id)
  }, [fetch, pollInterval])

  const addComment = async (content) => {
    const { data } = await commentsApi.create(placeId, content)
    setComments(prev => [data, ...prev])
    return data
  }

  const deleteComment = async (commentId) => {
    await commentsApi.delete(commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  return { comments, loading, addComment, deleteComment }
}
