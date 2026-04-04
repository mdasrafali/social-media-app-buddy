import { useRef } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { uploadImageApi } from '../../../api/uploadApi'
import { createStoryApi } from '../../../api/storyApi'
import StoryItemMobile from './StoryItemMobile'

export default function MobileStory({ stories, onStoryCreated }) {
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const ownStory = stories.find(
    (s) => s.author._id.toString() === user._id.toString()
  ) || null

  const othersStories = stories.filter(
    (s) => s.author._id.toString() !== user._id.toString()
  )

  const handleImageSelect = async (file) => {
    if (!file) return
    try {
      const { data: uploadData } = await uploadImageApi(file)
      const { data: storyData } = await createStoryApi(uploadData.data.url)
      onStoryCreated(storyData.data.story)
    } catch (err) {
      console.error('Story upload failed:', err)
    }
  }

  const ownCard = {
    _id: 'own',
    isOwnStory: true,
    image: ownStory ? ownStory.imageUrl : (user?.avatar || 'assets/images/mobile_story_img.png'),
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
        onChange={(e) => {
          if (e.target.files[0]) handleImageSelect(e.target.files[0])
          e.target.value = ''
        }}
      />
      <div className="_feed_inner_ppl_card_mobile _mar_b16">
        <div className="_feed_inner_ppl_card_area">
          <ul className="_feed_inner_ppl_card_area_list">
            {allCards.map((card) => (
              <StoryItemMobile
                key={card._id}
                {...card}
                onAddStory={card.isOwnStory ? () => fileInputRef.current.click() : undefined}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
