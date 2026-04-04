import { useEffect, useState } from 'react'
import { getCommentsApi } from '../../../api/commentApi'
import CommentInput from './CommentInput'
import CommentItem from './CommentItem'

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const loadComments = async (nextCursor = null) => {
    try {
      const { data } = await getCommentsApi(postId, nextCursor)
      const { comments: fetched, pagination } = data.data
      setComments((prev) => nextCursor ? [...prev, ...fetched] : fetched)
      setCursor(pagination.nextCursor)
      setHasNextPage(pagination.hasNextPage)
      setLoaded(true)
    } catch (err) {
      console.error('Failed to load comments:', err)
    }
  }

  useEffect(() => {
    loadComments()
  }, [postId])

  const handleCommentAdded = (newComment) => {
    setComments((prev) => [newComment, ...prev])
  }

  const handleCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId))
  }

  return (
    <>
      <div className="_feed_inner_timeline_cooment_area">
        <CommentInput postId={postId} onCommentAdded={handleCommentAdded} />
      </div>
      <div className="_timline_comment_main">
        {hasNextPage && (
          <div className="_previous_comment">
            <button
              type="button"
              className="_previous_comment_txt"
              onClick={() => loadComments(cursor)}
            >
              View previous comments
            </button>
          </div>
        )}
        {loaded && comments.length === 0 && (
          <p style={{ padding: '8px 24px', opacity: 0.5, fontSize: '13px' }}>
            No comments yet.
          </p>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            postId={postId}
            onDeleted={handleCommentDeleted}
          />
        ))}
      </div>
    </>
  )
}
