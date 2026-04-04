export default function StoryItemMobile({ isOwnStory, image, name, status, onAddStory }) {
  if (isOwnStory) {
    return (
      <li className="_feed_inner_ppl_card_area_item">
        <a href="#0" className="_feed_inner_ppl_card_area_link">
          <div className="_feed_inner_ppl_card_area_story">
            <img src={image} alt="Image" className="_card_story_img" />
            <div className="_feed_inner_ppl_btn">
              <button className="_feed_inner_ppl_btn_link" type="button" onClick={onAddStory}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 2.5v7M2.5 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
          <p className="_feed_inner_ppl_card_area_link_txt">
            {name || "Your Story"}
          </p>
        </a>
      </li>
    );
  }

  const statusClass =
    status === "inactive"
      ? "_feed_inner_ppl_card_area_story_inactive"
      : "_feed_inner_ppl_card_area_story_active";

  return (
    <li className="_feed_inner_ppl_card_area_item">
      <a href="#0" className="_feed_inner_ppl_card_area_link">
        <div className={statusClass}>
          <img src={image} alt="Image" className="_card_story_img1" />
        </div>
        <p className="_feed_inner_ppl_card_area_txt">{name}</p>
      </a>
    </li>
  );
}
