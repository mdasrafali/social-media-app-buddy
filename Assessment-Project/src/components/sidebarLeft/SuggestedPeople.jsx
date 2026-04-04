import ItemPeopleSuggested from "./ItemPeopleSuggested";
import People1 from "../../assets/images/chat1_img.png"
import People2 from "../../assets/images/chat2_img.png"
import People3 from "../../assets/images/chat3_img.png"

const SUGGESTED_PEOPLE = [
  { image: People1, name: "Steve Jobs", role: "CEO of Apple", imgClass: "_info_img" },
  { image: People2, name: "Ryan Roslansky", role: "CEO of Linkedin", imgClass: "_info_img1" },
  { image: People3, name: "Dylan Field", role: "CEO of Figma", imgClass: "_info_img1" },
];

export default function SuggestedPeople() {
  return (
    <>
      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_suggest _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_left_inner_area_suggest_content _mar_b24">
            <h4 className="_left_inner_area_suggest_content_title _title5">
              Suggested People
            </h4>
            <span className="_left_inner_area_suggest_content_txt">
              <a
                className="_left_inner_area_suggest_content_txt_link"
                href="#0"
              >
                See All
              </a>
            </span>
          </div>

          {SUGGESTED_PEOPLE.map((person) => (
            <ItemPeopleSuggested
              key={person.name}
              image={person.image}
              name={person.name}
              role={person.role}
              imgClass={person.imgClass}
            />
          ))}
        </div>
      </div>
    </>
  );
}
