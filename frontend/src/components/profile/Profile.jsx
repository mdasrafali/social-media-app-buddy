import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DropdownProfile from "./DropdownProfile";
import { getAvatar } from "../../utils/avatar";

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const avatarSrc = getAvatar(user?.avatar);
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Guest";

  return (
    <>
      <div className="_header_nav_profile">
        <div className="_header_nav_profile_image">
          <img
            src={avatarSrc}
            alt="Image"
            className="_nav_profile_img"
          />
        </div>
        <div 
          className="_header_nav_dropdown"
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: "pointer" }}
        >
          <p className="_header_nav_para">{displayName}</p>
          <button
            id="_profile_drop_show_btn"
            className="_header_nav_dropdown_btn _dropdown_toggle"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="6"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                fill="#112032"
                d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z"
              />
            </svg>
          </button>
        </div>
        {/* <!-- dropdown --> */}
        <DropdownProfile isOpen={isOpen} />
      </div>
    </>
  );
}
