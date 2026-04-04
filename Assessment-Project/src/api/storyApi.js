import api from './axiosInstance';

export const getStoriesApi  = ()           => api.get('/stories');
export const createStoryApi = (imageUrl)   => api.post('/stories', { imageUrl });
export const deleteStoryApi = (storyId)    => api.delete(`/stories/${storyId}`);
