import { useEffect, useState } from 'react'
import { getStoriesApi } from '../../../api/storyApi'
import { useAuth } from '../../../context/AuthContext'
import DesktopStory from './DesktopStory'
import MobileStory from './MobileStory'

export default function StoryContainer() {
  const { user } = useAuth()
  const [stories, setStories] = useState([])

  useEffect(() => {
    getStoriesApi()
      .then(({ data }) => setStories(data.data.stories))
      .catch(() => {})
  }, [])

  const handleStoryCreated = (newStory) => {
    // Own story always stays first; replace previous own story card if exists
    setStories((prev) => [
      newStory,
      ...prev.filter((s) => s.author._id.toString() !== user._id.toString()),
    ])
  }

  return (
    <>
      <DesktopStory stories={stories} onStoryCreated={handleStoryCreated} />
      <MobileStory  stories={stories} onStoryCreated={handleStoryCreated} />
    </>
  )
}
