import api from './axiosInstance';

export const getFeedApi = (cursor = null, limit = 10) => {
  const params = { limit };
  if (cursor) params.cursor = cursor;
  return api.get('/posts', { params });
};

export const createPostApi = (data) => api.post('/posts', data);

export const deletePostApi = (postId) => api.delete(`/posts/${postId}`);

export const togglePostLikeApi = (postId) => api.post(`/posts/${postId}/likes`);
