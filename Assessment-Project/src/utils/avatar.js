import DEFAULT_AVATAR from '../assets/images/Avatar.png';

/**
 * Returns the avatar URL if present, otherwise the app-wide default avatar.
 * Use this in every component that displays a user photo.
 *
 * @param {string|null|undefined} url - avatar URL from user/post/comment data
 * @returns {string} resolved image src
 */
export function getAvatar(url) {
  return url || DEFAULT_AVATAR;
}
