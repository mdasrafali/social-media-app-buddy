import axiosInstance from './axiosInstance';

export const getNotificationsApi = (params = {}) =>
  axiosInstance.get('/notifications', { params });

export const getUnreadCountApi = () =>
  axiosInstance.get('/notifications/unread-count');

export const markAllReadApi = () =>
  axiosInstance.patch('/notifications/read-all');

export const markOneReadApi = (id) =>
  axiosInstance.patch(`/notifications/${id}/read`);
