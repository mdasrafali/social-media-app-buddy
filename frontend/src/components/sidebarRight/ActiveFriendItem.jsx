const ActiveIcon = () => (
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
);

export default function ActiveFriendItem({ image, name, role, status = "active", time }) {
  const isInactive = status === "inactive";
  const containerClass = `_feed_right_inner_area_card_ppl${isInactive ? " _feed_right_inner_area_card_ppl_inactive" : ""}`;

  return (
    <div className={containerClass}>
      <div className="_feed_right_inner_area_card_ppl_box">
        <div className="_feed_right_inner_area_card_ppl_image">
          <a href="#0">
            <img
              src={image}
              alt=""
              className="_box_ppl_img"
            />
          </a>
        </div>
        <div className="_feed_right_inner_area_card_ppl_txt">
          <a href="#0">
            <h4 className="_feed_right_inner_area_card_ppl_title">
              {name}
            </h4>
          </a>
          <p className="_feed_right_inner_area_card_ppl_para">{role}</p>
        </div>
      </div>
      <div className="_feed_right_inner_area_card_ppl_side">
        {isInactive ? <span>{time || "5 minute ago"}</span> : <ActiveIcon />}
      </div>
    </div>
  );
}
