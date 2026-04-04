import { getAvatar } from '../../utils/avatar';
import timeAgo from '../../utils/timeAgo';

const NOTIFICATION_TEXT = {
  like_post: 'liked your post.',
  like_comment: 'liked your comment.',
  comment_post: 'commented on your post.',
  reply_comment: 'replied to your comment.',
};

export default function NotificationItem({ notification }) {
  const actorName = `${notification.actor.firstName} ${notification.actor.lastName}`;
  const avatarSrc = getAvatar(notification.actor.avatar);
  const actionText = NOTIFICATION_TEXT[notification.type] || 'interacted with your content.';

  return (
    <>
      <div className="_notification_image">
        <img
          src={avatarSrc}
          alt="Image"
          className="_notify_img"
        />
      </div>
      <div className="_notification_txt">
        <p className="_notification_para">
          <span className="_notify_txt_link">{actorName}</span>{' '}
          {actionText}
        </p>
        <div className="_nitification_time">
          <span>{timeAgo(notification.createdAt)}</span>
        </div>
      </div>
    </>
  );
}
