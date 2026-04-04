import api from './axiosInstance';

/**
 * Uploads a single image file to the backend, which streams it to Cloudinary.
 * Returns { url, publicId } on success.
 *
 * We send multipart/form-data — axios sets the Content-Type boundary automatically
 * when you pass a FormData instance, so do NOT set Content-Type manually.
 */
export const uploadImageApi = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
