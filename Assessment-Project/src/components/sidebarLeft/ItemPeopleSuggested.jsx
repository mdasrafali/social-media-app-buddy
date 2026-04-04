export default function ItemPeopleSuggested() {
  return (
    <div className="_left_inner_area_suggest_info">
      <div className="_left_inner_area_suggest_info_box">
        <div className="_left_inner_area_suggest_info_image">
          <a href="profile.html">
            <img
              src="assets/images/people1.png"
              alt="Image"
              className="_info_img"
            />
          </a>
        </div>
        <div className="_left_inner_area_suggest_info_txt">
          <a href="profile.html">
            <h4 className="_left_inner_area_suggest_info_title">Steve Jobs</h4>
          </a>
          <p className="_left_inner_area_suggest_info_para">CEO of Apple</p>
        </div>
      </div>
      <div className="_left_inner_area_suggest_info_link">
        {" "}
        <a href="#0" className="_info_link">
          Connect
        </a>
      </div>
    </div>
  );
}
