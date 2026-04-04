import { useState, useEffect, useRef, useCallback } from 'react';
import { getPostLikesApi } from '../../../api/postApi';
import { getAvatar } from '../../../utils/avatar';

export default function PostLikesModal({ postId, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const listRef = useRef(null);

  const fetchLikes = useCallback(async (cursor = null) => {
    setLoading(true);
    try {
      const { data } = await getPostLikesApi(postId, cursor, 20);
      const { users: fetched, pagination } = data.data;
      setUsers((prev) => (cursor ? [...prev, ...fetched] : fetched));
      setHasNextPage(pagination.hasNextPage);
      setNextCursor(pagination.nextCursor);
    } catch (err) {
      console.error('Failed to fetch likes:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1040,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%', maxWidth: '420px',
          backgroundColor: 'var(--card-bg, #fff)',
          borderRadius: '8px',
          zIndex: 1050,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color, #eee)',
        }}>
          <h5 className="_title5" style={{ margin: 0 }}>People who liked this</h5>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '20px',
              color: 'var(--text-color, #444)',
              lineHeight: 1,
            }}
          >
            &#x2715;
          </button>
        </div>

        {/* Body */}
        <div ref={listRef} style={{ overflowY: 'auto', flex: 1, padding: '8px 0' }}>
          {users.length === 0 && !loading && (
            <p style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
              No likes yet.
            </p>
          )}

          {users.map((user) => (
            <div
              key={user._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 20px',
              }}
            >
              <img
                src={getAvatar(user.avatar)}
                alt=""
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span className="_feed_inner_timeline_post_box_title">
                {user.firstName} {user.lastName}
              </span>
            </div>
          ))}

          {loading && (
            <p style={{ textAlign: 'center', padding: '12px', color: '#888' }}>Loading...</p>
          )}

          {hasNextPage && !loading && (
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <button
                onClick={() => fetchLikes(nextCursor)}
                className="_info_link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
