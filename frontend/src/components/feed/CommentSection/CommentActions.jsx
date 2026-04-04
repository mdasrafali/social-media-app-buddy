import { useAuth } from '../../../context/AuthContext'
import { toggleCommentLikeApi, deleteCommentApi } from '../../../api/commentApi'
import timeAgo from '../../../utils/timeAgo'

export default function CommentActions({ comment, liked, onLikeToggled, onDeleted, onReplyClick }) {
  const { user } = useAuth()
  const isOwner = user && comment.author._id === user._id

  const handleLike = async () => {
    try {
      const { data } = await toggleCommentLikeApi(comment._id)
      onLikeToggled(data.data)
    } catch (err) {
      console.error('Like failed:', err)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await deleteCommentApi(comment._id)
      onDeleted(comment._id)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="_comment_reply">
      <div className="_comment_reply_num">
        <ul className="_comment_reply_list">
          <li>
            <span
              onClick={handleLike}
              style={{ cursor: 'pointer', fontWeight: liked ? 'bold' : 'normal' }}
            >
              {liked ? 'Liked.' : 'Like.'}
            </span>
          </li>
          <li>
            <span onClick={onReplyClick} style={{ cursor: 'pointer' }}>Reply.</span>
          </li>
          {isOwner && (
            <li>
              <span onClick={handleDelete} style={{ cursor: 'pointer', color: '#f44' }}>Delete.</span>
            </li>
          )}
          <li>
            <span className="_time_link">.{timeAgo(comment.createdAt)}</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
