import ActiveFriendItem from "./ActiveFriendItem";
import ActiveFriendsHeader from "./ActiveFriendsHeader";

export default function ActiveFriends() {
  return (
    <>
      <div className="_layout_right_sidebar_inner">
        <div className="_feed_right_inner_area_card  _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <ActiveFriendsHeader/>
          <div className="_feed_bottom_fixed">


            <ActiveFriendItem/>


            {/* <div className="_feed_right_inner_area_card_ppl _feed_right_inner_area_card_ppl_inactive ">
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
                  <p className="_feed_right_inner_area_card_ppl_para">
                    CEO of Apple
                  </p>
                </div>
              </div>
              <div className="_feed_right_inner_area_card_ppl_side">
                {" "}
                <span>5 minute ago</span>
              </div>
            </div>
            <div className="_feed_right_inner_area_card_ppl">
              <div className="_feed_right_inner_area_card_ppl_box">
                <div className="_feed_right_inner_area_card_ppl_image">
                  <a href="profile.html">
                    <img
                      src="assets/images/people2.png"
                      alt=""
                      className="_box_ppl_img"
                    />
                  </a>
                </div>
                <div className="_feed_right_inner_area_card_ppl_txt">
                  <a href="profile.html">
                    <h4 className="_feed_right_inner_area_card_ppl_title">
                      Ryan Roslansky
                    </h4>
                  </a>
                  <p className="_feed_right_inner_area_card_ppl_para">
                    CEO of Linkedin
                  </p>
                </div>
              </div>
              <div className="_feed_right_inner_area_card_ppl_side">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <rect
                    width="12"
                    height="12"
                    x="1"
                    y="1"
                    fill="#0ACF83"
                    stroke="#fff"
                    strokeWidth="2"
                    rx="6"
                  />
                </svg>
              </div>
            </div>
            <div className="_feed_right_inner_area_card_ppl">
              <div className="_feed_right_inner_area_card_ppl_box">
                <div className="_feed_right_inner_area_card_ppl_image">
                  <a href="profile.html">
                    <img
                      src="assets/images/people3.png"
                      alt=""
                      className="_box_ppl_img"
                    />
                  </a>
                </div>
                <div className="_feed_right_inner_area_card_ppl_txt">
                  <a href="profile.html">
                    <h4 className="_feed_right_inner_area_card_ppl_title">
                      Dylan Field
                    </h4>
                  </a>
                  <p className="_feed_right_inner_area_card_ppl_para">
                    CEO of Figma
                  </p>
                </div>
              </div>
              <div className="_feed_right_inner_area_card_ppl_side">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <rect
                    width="12"
                    height="12"
                    x="1"
                    y="1"
                    fill="#0ACF83"
                    stroke="#fff"
                    strokeWidth="2"
                    rx="6"
                  />
                </svg>
              </div>
            </div>
            <div className="_feed_right_inner_area_card_ppl _feed_right_inner_area_card_ppl_inactive">
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
                  <p className="_feed_right_inner_area_card_ppl_para">
                    CEO of Apple
                  </p>
                </div>
              </div>
              <div className="_feed_right_inner_area_card_ppl_side">
                {" "}
                <span>5 minute ago</span>
              </div>
            </div>
            <div className="_feed_right_inner_area_card_ppl">
              <div className="_feed_right_inner_area_card_ppl_box">
                <div className="_feed_right_inner_area_card_ppl_image">
                  <a href="profile.html">
                    <img
                      src="assets/images/people2.png"
                      alt=""
                      className="_box_ppl_img"
                    />
                  </a>
                </div>
                <div className="_feed_right_inner_area_card_ppl_txt">
                  <a href="profile.html">
                    <h4 className="_feed_right_inner_area_card_ppl_title">
                      Ryan Roslansky
                    </h4>
                  </a>
                  <p className="_feed_right_inner_area_card_ppl_para">
                    CEO of Linkedin
                  </p>
                </div>
              </div>
              <div className="_feed_right_inner_area_card_ppl_side">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <rect
                    width="12"
                    height="12"
                    x="1"
                    y="1"
                    fill="#0ACF83"
                    stroke="#fff"
                    strokeWidth="2"
                    rx="6"
                  />
                </svg>
              </div>
            </div>
            <div className="_feed_right_inner_area_card_ppl">
              <div className="_feed_right_inner_area_card_ppl_box">
                <div className="_feed_right_inner_area_card_ppl_image">
                  <a href="profile.html">
                    <img
                      src="assets/images/people3.png"
                      alt=""
                      className="_box_ppl_img"
                    />
                  </a>
                </div>
                <div className="_feed_right_inner_area_card_ppl_txt">
                  <a href="profile.html">
                    <h4 className="_feed_right_inner_area_card_ppl_title">
                      Dylan Field
                    </h4>
                  </a>
                  <p className="_feed_right_inner_area_card_ppl_para">
                    CEO of Figma
                  </p>
                </div>
              </div>
              <div className="_feed_right_inner_area_card_ppl_side">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <rect
                    width="12"
                    height="12"
                    x="1"
                    y="1"
                    fill="#0ACF83"
                    stroke="#fff"
                    strokeWidth="2"
                    rx="6"
                  />
                </svg>
              </div>
            </div>
            <div className="_feed_right_inner_area_card_ppl">
              <div className="_feed_right_inner_area_card_ppl_box">
                <div className="_feed_right_inner_area_card_ppl_image">
                  <a href="profile.html">
                    <img
                      src="assets/images/people3.png"
                      alt=""
                      className="_box_ppl_img"
                    />
                  </a>
                </div>
                <div className="_feed_right_inner_area_card_ppl_txt">
                  <a href="profile.html">
                    <h4 className="_feed_right_inner_area_card_ppl_title">
                      Dylan Field
                    </h4>
                  </a>
                  <p className="_feed_right_inner_area_card_ppl_para">
                    CEO of Figma
                  </p>
                </div>
              </div>
              <div className="_feed_right_inner_area_card_ppl_side">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <rect
                    width="12"
                    height="12"
                    x="1"
                    y="1"
                    fill="#0ACF83"
                    stroke="#fff"
                    strokeWidth="2"
                    rx="6"
                  />
                </svg>
              </div>
            </div>
            <div className="_feed_right_inner_area_card_ppl _feed_right_inner_area_card_ppl_inactive">
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
                  <p className="_feed_right_inner_area_card_ppl_para">
                    CEO of Apple
                  </p>
                </div>
              </div>
              <div className="_feed_right_inner_area_card_ppl_side">
                {" "}
                <span>5 minute ago</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
