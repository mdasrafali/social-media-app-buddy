import { useState, useRef, useEffect } from "react";
import { getAvatar } from "../../../utils/avatar";
import timeAgo from "../../../utils/timeAgo";
import PostHeaderDropdown from "./PostHeaderDropdown";

export default function PostHeader({ post, onPostDeleted }) {
  const avatarSrc = getAvatar(post.author.avatar);
  const authorName = `${post.author.firstName} ${post.author.lastName}`;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownWrapperRef = useRef(null);

  // Close when clicking outside the entire dropdown wrapper
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownWrapperRef.current && !dropdownWrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <>
      <div className="_feed_inner_timeline_post_top">
        <div className="_feed_inner_timeline_post_box">
          <div className="_feed_inner_timeline_post_box_image">
            <img src={avatarSrc} alt="" className="_post_img" />
          </div>
          <div className="_feed_inner_timeline_post_box_txt">
            <h4 className="_feed_inner_timeline_post_box_title">
              {authorName}
            </h4>
            <p className="_feed_inner_timeline_post_box_para">
              {timeAgo(post.createdAt)} .
              <a href="#0">
                {post.visibility === "private" ? "Private" : "Public"}
              </a>
            </p>
          </div>
        </div>
        <div
          ref={dropdownWrapperRef}
          className="_feed_inner_timeline_post_box_dropdown"
        >
          <div className="_feed_timeline_post_dropdown">
            <button
              id="_timeline_show_drop_btn"
              className="_feed_timeline_post_dropdown_link"
              onClick={() => setIsDropdownOpen((v) => !v)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="4"
                height="17"
                fill="none"
                viewBox="0 0 4 17"
              >
                <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
              </svg>
            </button>
          </div>

          <PostHeaderDropdown
            post={post}
            onPostDeleted={onPostDeleted}
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
          />
        </div>
      </div>
    </>
  );
}
