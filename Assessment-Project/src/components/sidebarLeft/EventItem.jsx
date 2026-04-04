export default function EventItem({ eventName }) {
  return (
    <>
      <a className="_left_inner_event_card_link" href="event-single.html">
        <div className="_left_inner_event_card">
          <div className="_left_inner_event_card_iamge">
            <img
              src="assets/images/feed_event1.png"
              alt="Image"
              className="_card_img"
            />
          </div>
          <div className="_left_inner_event_card_content">
            <div className="_left_inner_card_date">
              <p className="_left_inner_card_date_para">10</p>
              <p className="_left_inner_card_date_para1">Jul</p>
            </div>
            <div className="_left_inner_card_txt">
              <h4 className="_left_inner_event_card_title">
                {eventName}
                </h4>
            </div>
          </div>
          <hr className="_underline" />
          <div className="_left_inner_event_bottom">
            <p className="_left_iner_event_bottom">17 People Going</p>{" "}
            <div href="#0" className="_left_iner_event_bottom_link">
              Going
            </div>
          </div>
        </div>
      </a>
    </>
  );
}
