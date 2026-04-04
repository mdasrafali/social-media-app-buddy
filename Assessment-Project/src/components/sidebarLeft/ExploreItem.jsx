export default function ExploreItem({ itemName, icon, isNew }) {
  return (
    <a href="#0" className="_left_inner_area_explore_link">
      {icon}
      {itemName}
      {isNew && (
        <>
          {" "}
          <span className="_left_inner_area_explore_link_txt">New</span>
        </>
      )}
    </a>
  );
}