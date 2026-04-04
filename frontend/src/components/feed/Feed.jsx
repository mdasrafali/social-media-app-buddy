import { useCallback } from 'react'
import { getFeedApi } from '../../api/postApi'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import CreatePost from './CreatePost/CreatePost'
import PostList from './PostSection/PostList'
import StoryContainer from './Story/StoryContainer'

export default function Feed() {
  const feedFetcher = useCallback(
    (cursor) =>
      getFeedApi(cursor).then(({ data }) => ({
        items: data.data.posts,
        pagination: data.data.pagination,
      })),
    []
  )

  const { items: posts, loading, hasNextPage, loadMore, prepend, remove } =
    usePaginatedList(feedFetcher)

  return (
    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
      <div className="_layout_middle_wrap">
        <div className="_layout_middle_inner">
          <StoryContainer />
          <CreatePost onPostCreated={prepend} />
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Loading feed...</p>
          ) : (
            <PostList posts={posts} onPostDeleted={remove} />
          )}
          {hasNextPage && (
            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <button className="_previous_comment_txt" onClick={loadMore}>
                Load more posts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
