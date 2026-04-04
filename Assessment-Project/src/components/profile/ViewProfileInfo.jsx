import { useAuth } from "../../context/AuthContext";

export default function ViewProfileInfo() {
  const { user } = useAuth();
  const avatarSrc = user?.avatar || "assets/images/profile.png";
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Guest";

  return (
    <div className="_nav_profile_dropdown_info">
      <div className="_nav_profile_dropdown_image">
        <img src={avatarSrc} alt="Image" className="_nav_drop_img" />
      </div>
      <div className="_nav_profile_dropdown_info_txt">
        <h4 className="_nav_dropdown_title">{displayName}</h4>
        <a href="#0" className="_nav_drop_profile">
          View Profile
        </a>
      </div>
    </div>
  );
}
