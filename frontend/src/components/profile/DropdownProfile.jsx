import ProfileDropdownLink from "./ProfileDropdownLink";
import ViewProfileInfo from "./ViewProfileInfo";

export default function DropdownProfile({isOpen}) {
  return (
    <>
      <div
        id="_prfoile_drop"
        className={`_nav_profile_dropdown _profile_dropdown ${isOpen ? "show" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <ViewProfileInfo />
        <hr />
        <ul className="_nav_dropdown_list">
          <ProfileDropdownLink linkAction={"Settings"} />
          <ProfileDropdownLink linkAction={"Help & Support"} />
          <ProfileDropdownLink linkAction={"Log Out"} />
        </ul>
      </div>
    </>
  );
}
