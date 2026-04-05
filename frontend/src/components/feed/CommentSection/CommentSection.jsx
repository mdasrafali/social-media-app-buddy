import { useCallback } from 'react'
import { getCommentsApi } from '../../../api/commentApi'
import { usePaginatedList } from '../../../hooks/usePaginatedList'
import CommentInput from './CommentInput'
import CommentItem from './CommentItem'

export default function CommentSection({ postId, onCommentAdded }) {
  const commentFetcher = useCallback(
    (cursor) =>
      getCommentsApi(postId, cursor).then(({ data }) => ({
        items: data.data.comments,
        pagination: data.data.pagination,
      })),
    [postId]
  )

  const { items: comments, loading, hasNextPage, loadMore, prepend, remove } =
    usePaginatedList(commentFetcher)

  const handleCommentAdded = useCallback(
    (comment) => {
      prepend(comment)
      onCommentAdded?.()
    },
    [prepend, onCommentAdded]
  )

  return (
    <>
      <div className="_feed_inner_timeline_cooment_area">
        <CommentInput postId={postId} onCommentAdded={handleCommentAdded} />
      </div>
      <div className="_timline_comment_main">
        {hasNextPage && (
          <div className="_previous_comment">
            <button type="button" className="_previous_comment_txt" onClick={loadMore}>
              View previous comments
            </button>
          </div>
        )}
        {!loading && comments.length === 0 && (
          <p style={{ padding: '8px 24px', opacity: 0.5, fontSize: '13px' }}>
            No comments yet.
          </p>
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            postId={postId}
            onDeleted={remove}
          />
        ))}
      </div>
    </>
  )
}
