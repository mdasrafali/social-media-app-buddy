import ProfileDropdownLink from "./ProfileDropdownLink";
import ViewProfileInfo from "./ViewProfileInfo";

export default function DropdownProfile() {
  return (
    <div>
      <div
        id="_prfoile_drop"
        className="_nav_profile_dropdown _profile_dropdown"
      >
        <ViewProfileInfo />
        <hr />
        <ul className="_nav_dropdown_list">
          <ProfileDropdownLink linkAction={"Settings"} />
          <ProfileDropdownLink linkAction={"Help & Support"} />
          <ProfileDropdownLink linkAction={"Log Out"} />
        </ul>
      </div>
    </div>
  );
}
