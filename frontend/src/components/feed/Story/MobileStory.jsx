import { useAuth } from '../../../context/AuthContext'
import { getAvatar } from '../../../utils/avatar'
import { useStoryUpload } from '../../../hooks/useStoryUpload'
import StoryItemMobile from './StoryItemMobile'

export default function MobileStory({ stories, onStoryCreated }) {
  const { user } = useAuth()
  const avatarSrc = getAvatar(user?.avatar)
  const { fileInputRef, handleFileChange, openPicker } = useStoryUpload(onStoryCreated)

  const ownStory =
    stories.find((s) => s.author._id.toString() === user._id.toString()) || null

  const othersStories = stories.filter(
    (s) => s.author._id.toString() !== user._id.toString()
  )

  const ownCard = {
    _id: 'own',
    isOwnStory: true,
    image: ownStory ? ownStory.imageUrl : user?.avatar || avatarSrc,
    name: 'Your Story',
  }

  const otherCards = othersStories.map((s) => ({
    _id: s._id,
    isOwnStory: false,
    image: s.imageUrl,
    name: s.author.firstName,
    status: 'active',
  }))

  const allCards = [ownCard, ...otherCards]

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div className="_feed_inner_ppl_card_mobile _mar_b16">
        <div className="_feed_inner_ppl_card_area">
          <ul className="_feed_inner_ppl_card_area_list">
            {allCards.map((card) => (
              <StoryItemMobile
                key={card._id}
                {...card}
                onAddStory={card.isOwnStory ? openPicker : undefined}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
