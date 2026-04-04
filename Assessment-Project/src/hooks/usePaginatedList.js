import { useState, useCallback, useEffect, useRef } from 'react'

/**
 * Generic cursor-based pagination hook.
 *
 * @param {Function} fetcher - async (cursor: string|null) => { items: any[], pagination: { hasNextPage: boolean, nextCursor: string|null } }
 * @param {Object}  [options]
 * @param {boolean} [options.autoLoad=true] - automatically load the first page on mount
 *
 * @returns {{
 *   items: any[],
 *   loading: boolean,
 *   hasNextPage: boolean,
 *   loadMore: () => void,
 *   reload: () => void,
 *   prepend: (item: any) => void,
 *   remove: (id: string) => void,
 * }}
 *
 * Usage:
 *   const fetcher = useCallback(
 *     (cursor) => getCommentsApi(postId, cursor).then(({ data }) => ({
 *       items: data.data.comments,
 *       pagination: data.data.pagination,
 *     })),
 *     [postId]
 *   )
 *   const { items, loading, hasNextPage, loadMore, prepend, remove } = usePaginatedList(fetcher)
 */
export function usePaginatedList(fetcher, { autoLoad = true } = {}) {
  // Start in loading state when autoLoad is on to avoid "empty" flash before first fetch
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(autoLoad)
  const [hasNextPage, setHasNextPage] = useState(false)

  // Store cursor in a ref — changing it must not trigger re-renders
  const cursorRef = useRef(null)

  // Keep fetcher current via ref so the stable `load` callback always calls the latest version
  const fetcherRef = useRef(fetcher)
  useEffect(() => { fetcherRef.current = fetcher }, [fetcher])

  // Core load function — stable identity, uses refs to avoid stale closures
  const load = useCallback(async (cursor = null) => {
    setLoading(true)
    try {
      const { items: fetched, pagination } = await fetcherRef.current(cursor)
      setItems((prev) => (cursor ? [...prev, ...fetched] : fetched))
      cursorRef.current = pagination.nextCursor
      setHasNextPage(pagination.hasNextPage)
    } catch (err) {
      console.error('usePaginatedList fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, []) // intentionally empty — stability guaranteed via fetcherRef

  /** Load the next page using the stored cursor. */
  const loadMore = useCallback(() => load(cursorRef.current), [load])

  /** Reset to the first page and reload. */
  const reload = useCallback(() => {
    cursorRef.current = null
    return load(null)
  }, [load])

  /** Prepend a newly created item to the top of the list. */
  const prepend = useCallback((item) => setItems((prev) => [item, ...prev]), [])

  /** Remove an item by its `_id` (after deletion). */
  const remove = useCallback(
    (id) => setItems((prev) => prev.filter((i) => i._id !== id)),
    []
  )

  useEffect(() => {
    if (autoLoad) reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // only run on mount — reload is stable, autoLoad is a constant option

  return { items, loading, hasNextPage, loadMore, reload, prepend, remove }
}
