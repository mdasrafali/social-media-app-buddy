export default function ItemPeopleSuggested({ image, name, role, imgClass = "_info_img" }) {
  return (
    <div className="_left_inner_area_suggest_info">
      <div className="_left_inner_area_suggest_info_box">
        <div className="_left_inner_area_suggest_info_image">
          <a href="#0">
            <img
              src={image}
              alt="Image"
              className={imgClass}
            />
          </a>
        </div>
        <div className="_left_inner_area_suggest_info_txt">
          <a href="#0">
            <h4 className="_left_inner_area_suggest_info_title">{name}</h4>
          </a>
          <p className="_left_inner_area_suggest_info_para">{role}</p>
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
