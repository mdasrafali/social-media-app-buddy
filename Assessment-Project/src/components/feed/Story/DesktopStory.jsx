import { useRef } from "react";
import { createStoryApi } from "../../../api/storyApi";
import { uploadImageApi } from "../../../api/uploadApi";
import { useAuth } from "../../../context/AuthContext";
import StoryItemDesktop from "./StoryItemDesktop";
import { getAvatar } from '../../../utils/avatar'

// Mirrors the original hardcoded colClass pattern exactly
const getColClass = (index) => {
  if (index <= 1) return "col";
  if (index === 2) return "_custom_mobile_none";
  return "_custom_none";
};

export default function DesktopStory({ stories, onStoryCreated }) {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const avatarSrc = getAvatar(user?.avatar);

  const ownStory =
    stories.find((s) => s.author._id.toString() === user._id.toString()) ||
    null;

  const othersStories = stories
    .filter((s) => s.author._id.toString() !== user._id.toString())
    .slice(0, 3);

  const handleImageSelect = async (file) => {
    if (!file) return;
    try {
      const { data: uploadData } = await uploadImageApi(file);
      const { data: storyData } = await createStoryApi(uploadData.data.url);
      onStoryCreated(storyData.data.story);
    } catch (err) {
      console.error("Story upload failed:", err);
    }
  };

  const ownCard = {
    _id: "own",
    isOwnStory: true,
    image: ownStory
      ? ownStory.imageUrl
      : user?.avatar || avatarSrc,
    name: "Your Story",
  };

  const otherCards = othersStories.map((s) => ({
    _id: s._id,
    isOwnStory: false,
    image: s.imageUrl,
    profileImage: s.author.avatar || "assets/images/mini_pic.png",
    name: `${s.author.firstName} ${s.author.lastName}`,
  }));

  const allCards = [ownCard, ...otherCards];

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files[0]) handleImageSelect(e.target.files[0]);
          e.target.value = "";
        }}
      />
      <div className="_feed_inner_ppl_card _mar_b16">
        <div className="_feed_inner_story_arrow">
          <button type="button" className="_feed_inner_story_arrow_btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="8"
              fill="none"
              viewBox="0 0 9 8"
            >
              <path
                fill="#fff"
                d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z"
              />
            </svg>
          </button>
        </div>
        <div className="row">
          {allCards.map((card, index) => (
            <StoryItemDesktop
              key={card._id}
              {...card}
              colClass={getColClass(index)}
              onAddStory={
                card.isOwnStory ? () => fileInputRef.current.click() : undefined
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
