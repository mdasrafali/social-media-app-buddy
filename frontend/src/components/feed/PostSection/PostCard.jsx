import { useState } from 'react'
import { togglePostLikeApi } from '../../../api/postApi'
import CommentSection from '../CommentSection/CommentSection'
import PostActions from './PostActions'
import PostContent from './PostContent'
import PostHeader from './PostHeader'
import PostStats from './PostStats'
import PostLikesModal from './PostLikesModal'

export default function PostCard({ post, onPostDeleted }) {
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)
  const [liked, setLiked] = useState(post.isLikedByViewer || false)
  const [showLikesModal, setShowLikesModal] = useState(false)

  const handleLike = async () => {
    try {
      const { data } = await togglePostLikeApi(post._id)
      setLiked(data.data.liked)
      setLikesCount(data.data.likesCount)
    } catch (err) {
      console.error('Like failed:', err)
    }
  }

  return (
    <>
      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
          <PostHeader post={post} onPostDeleted={onPostDeleted} />
          <PostContent post={post} />
        </div>
        <PostStats
          post={post}
          likesCount={likesCount}
          onLikesClick={() => setShowLikesModal(true)}
        />
        <PostActions liked={liked} onLike={handleLike} />
        <CommentSection postId={post._id} commentsCount={post.commentsCount} />
      </div>

      {showLikesModal && (
        <PostLikesModal
          postId={post._id}
          onClose={() => setShowLikesModal(false)}
        />
      )}
    </>
  )
}
