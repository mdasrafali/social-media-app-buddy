export default function ActiveFriendsHeader() {
  return (
    <div className="_feed_top_fixed">
      <div className="_feed_right_inner_area_card_content _mar_b24">
        <h4 className="_feed_right_inner_area_card_content_title _title5">
          Your Friends
        </h4>
        <span className="_feed_right_inner_area_card_content_txt">
          <a
            className="_feed_right_inner_area_card_content_txt_link"
            href="find-friends.html"
          >
            See All
          </a>
        </span>
      </div>
      <form className="_feed_right_inner_area_card_form">
        <svg
          className="_feed_right_inner_area_card_form_svg"
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          fill="none"
          viewBox="0 0 17 17"
        >
          <circle cx="7" cy="7" r="6" stroke="#666"></circle>
          <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3"></path>
        </svg>
        <input
          className="form-control me-2 _feed_right_inner_area_card_form_inpt"
          type="search"
          placeholder="input search text"
          aria-label="Search"
        />
      </form>
    </div>
  );
}
