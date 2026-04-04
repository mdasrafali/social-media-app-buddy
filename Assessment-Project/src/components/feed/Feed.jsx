import { useCallback, useEffect, useState } from 'react'
import { getFeedApi } from '../../api/postApi'
import CreatePost from './CreatePost/CreatePost'
import PostList from './PostSection/PostList'
import StoryContainer from './Story/StoryContainer'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchPosts = useCallback(async (nextCursor = null) => {
    try {
      const { data } = await getFeedApi(nextCursor)
      const { posts: newPosts, pagination } = data.data
      setPosts((prev) => nextCursor ? [...prev, ...newPosts] : newPosts)
      setCursor(pagination.nextCursor)
      setHasNextPage(pagination.hasNextPage)
    } catch (err) {
      console.error('Failed to load feed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev])
  }

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId))
  }

  return (
    <>
      <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
        <div className="_layout_middle_wrap">
          <div className="_layout_middle_inner">
            <StoryContainer />
            <CreatePost onPostCreated={handlePostCreated} />
            {loading ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Loading feed...</p>
            ) : (
              <PostList
                posts={posts}
                onPostDeleted={handlePostDeleted}
              />
            )}
            {hasNextPage && (
              <div style={{ textAlign: 'center', margin: '16px 0' }}>
                <button
                  className="_previous_comment_txt"
                  onClick={() => fetchPosts(cursor)}
                >
                  Load more posts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
