import { useState } from 'react'
import CommentActions from './CommentActions'
import CommentInput from './CommentInput'
import CommentReactions from './CommentReactions'

export default function CommentItem({ comment, postId, onDeleted }) {
  const [showReply, setShowReply] = useState(false)
  const [replies, setReplies] = useState([])
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0)
  const [liked, setLiked] = useState(false)

  const avatarSrc = comment.author.avatar || 'assets/images/txt_img.png'
  const authorName = `${comment.author.firstName} ${comment.author.lastName}`

  const handleReplyAdded = (reply) => {
    setReplies((prev) => [...prev, reply])
    setShowReply(false)
  }

  return (
    <>
      <div className="_comment_main">
        <div className="_comment_image">
          <a href="#0" className="_comment_image_link">
            <img src={avatarSrc} alt="" className="_comment_img1" />
          </a>
        </div>
        <div className="_comment_area">
          <div className="_comment_details">
            <div className="_comment_details_top">
              <div className="_comment_name">
                <a href="#0">
                  <h4 className="_comment_name_title">{authorName}</h4>
                </a>
              </div>
            </div>
            <div className="_comment_status">
              <p className="_comment_status_text">
                <span>{comment.content}</span>
              </p>
            </div>
            <CommentReactions likesCount={likesCount} />
            <CommentActions
              comment={comment}
              postId={postId}
              liked={liked}
              onLikeToggled={(result) => {
                setLiked(result.liked)
                setLikesCount(result.likesCount)
              }}
              onDeleted={onDeleted}
              onReplyClick={() => setShowReply((v) => !v)}
            />
          </div>

          {/* Reply input */}
          {showReply && (
            <CommentInput
              postId={postId}
              parentCommentId={comment._id}
              onCommentAdded={handleReplyAdded}
            />
          )}

          {/* Existing replies */}
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              onDeleted={(id) => setReplies((prev) => prev.filter((r) => r._id !== id))}
            />
          ))}
        </div>
      </div>
    </>
  )
}
