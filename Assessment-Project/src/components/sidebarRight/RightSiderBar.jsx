import ActiveFriends from "./ActiveFriends";
import Sponsors from "./Sponsors";

export default function RightSiderBar() {
  return (
    <>
      <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
        <div className="_layout_right_sidebar_wrap">
          <Sponsors/>

          <ActiveFriends/>
        </div>
      </div>
    </>
  );
}
