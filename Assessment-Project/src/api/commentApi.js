import api from './axiosInstance';

export const getCommentsApi = (postId, cursor = null, limit = 10) => {
  const params = { limit };
  if (cursor) params.cursor = cursor;
  return api.get(`/posts/${postId}/comments`, { params });
};

export const addCommentApi = (postId, data) => api.post(`/posts/${postId}/comments`, data);

export const deleteCommentApi = (commentId) => api.delete(`/comments/${commentId}`);

export const toggleCommentLikeApi = (commentId) => api.post(`/comments/${commentId}/likes`);

export const getRepliesApi = (commentId, cursor = null) => {
  const params = { limit: 10 };
  if (cursor) params.cursor = cursor;
  return api.get(`/comments/${commentId}/replies`, { params });
};

export const addReplyApi = (postId, parentCommentId, content) =>
  api.post(`/posts/${postId}/comments`, { content, parentCommentId });
