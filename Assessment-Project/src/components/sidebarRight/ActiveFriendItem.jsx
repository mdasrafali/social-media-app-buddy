export default function ActiveFriendItem() {
  return (
    <div className="_feed_right_inner_area_card_ppl _feed_right_inner_area_card_ppl_inactive ">
      <div className="_feed_right_inner_area_card_ppl_box">
        <div className="_feed_right_inner_area_card_ppl_image">
          <a href="profile.html">
            <img
              src="assets/images/people1.png"
              alt=""
              className="_box_ppl_img"
            />
          </a>
        </div>
        <div className="_feed_right_inner_area_card_ppl_txt">
          <a href="profile.html">
            <h4 className="_feed_right_inner_area_card_ppl_title">
              Steve Jobs
            </h4>
          </a>
          <p className="_feed_right_inner_area_card_ppl_para">CEO of Apple</p>
        </div>
      </div>
      <div className="_feed_right_inner_area_card_ppl_side">
        {" "}
        <span>5 minute ago</span>
      </div>
    </div>
  );
}
