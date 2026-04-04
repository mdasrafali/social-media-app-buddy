export default function NotificationItems() {
  return (
    <>
      <div className="_notification_box">
        <div className="_notification_image">
          <img
            src="assets/images/friend-req.png"
            alt="Image"
            className="_notify_img"
          />
        </div>
        <div className="_notification_txt">
          <p className="_notification_para">
            <span className="_notify_txt_link">Steve Jobs</span>
            posted a link in your timeline.
          </p>
          <div className="_nitification_time">
            <span>42 miniutes ago</span>
          </div>
        </div>
      </div>
    </>
  );
}
