export default function PostContent({ post }) {
  return (
    <>
      {post.content && (
        <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
      )}
      {post.imageUrl && (
        <div className="_feed_inner_timeline_image">
          <img src={post.imageUrl} alt="" className="_time_img" />
        </div>
      )}
    </>
  )
}
