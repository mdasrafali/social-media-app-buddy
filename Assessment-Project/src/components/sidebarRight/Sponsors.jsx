const SPONSORS = [
  { image: "assets/images/Avatar.png", name: "Radovan SkillArena", role: "Founder & CEO at Trophy" },
  { image: "assets/images/recommend1.png", name: "Sarah Mitchell", role: "Product Designer at Figma" },
  { image: "assets/images/recommend2.png", name: "James Carter", role: "Software Engineer at Google" },
];

export default function Sponsors() {
  return (
    <>
      <div className="_layout_right_sidebar_inner">
        <div className="_right_inner_area_info _padd_t24  _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_right_inner_area_info_content _mar_b24">
            <h4 className="_right_inner_area_info_content_title _title5">
              You Might Like
            </h4>
            <span className="_right_inner_area_info_content_txt">
              <a className="_right_inner_area_info_content_txt_link" href="#0">
                See All
              </a>
            </span>
          </div>
          <hr className="_underline" />
          {SPONSORS.map((sponsor) => (
            <div key={sponsor.name} className="_right_inner_area_info_ppl">
              <div className="_right_inner_area_info_box">
                <div className="_right_inner_area_info_box_image">
                  <a href="#0">
                    <img
                      src={sponsor.image}
                      alt="Image"
                      className="_ppl_img"
                    />
                  </a>
                </div>
                <div className="_right_inner_area_info_box_txt">
                  <a href="#0">
                    <h4 className="_right_inner_area_info_box_title">
                      {sponsor.name}
                    </h4>
                  </a>
                  <p className="_right_inner_area_info_box_para">
                    {sponsor.role}
                  </p>
                </div>
              </div>
              <div className="_right_info_btn_grp">
                <button type="button" className="_right_info_btn_link">
                  Ignore
                </button>
                <button
                  type="button"
                  className="_right_info_btn_link _right_info_btn_link_active"
                >
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
