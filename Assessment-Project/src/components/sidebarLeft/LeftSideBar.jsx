import EventsList from "./EventsList";
import Explore from "./ExploreList";
import SuggestedPeople from "./SuggestedPeople";

export default function LeftSideBar() {
  return (
    <>
      <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
        <div className="_layout_left_sidebar_wrap">
          <Explore/>

          <SuggestedPeople/>
          <EventsList/>
        </div>
      </div>
    </>
  );
}
