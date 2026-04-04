export default function EventItem({ eventName, date = "10", month = "Jul", going = "17 People Going" }) {
  return (
    <>
      <a className="_left_inner_event_card_link" href="#0">
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
              <p className="_left_inner_card_date_para">{date}</p>
              <p className="_left_inner_card_date_para1">{month}</p>
            </div>
            <div className="_left_inner_card_txt">
              <h4 className="_left_inner_event_card_title">
                {eventName}
                </h4>
            </div>
          </div>
          <hr className="_underline" />
          <div className="_left_inner_event_bottom">
            <p className="_left_iner_event_bottom">{going}</p>{" "}
            <div href="#0" className="_left_iner_event_bottom_link">
              Going
            </div>
          </div>
        </div>
      </a>
    </>
  );
}
