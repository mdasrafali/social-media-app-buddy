import PostCard from './PostCard'

export default function PostList({ posts, onPostDeleted }) {
  if (!posts || posts.length === 0) {
    return (
      <p style={{ textAlign: 'center', padding: '20px', opacity: 0.6 }}>
        No posts yet. Be the first to post!
      </p>
    )
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onPostDeleted={onPostDeleted} />
      ))}
    </>
  )
}
