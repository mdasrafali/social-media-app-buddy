import { useRef } from 'react'
import { uploadImageApi } from '../api/uploadApi'
import { createStoryApi } from '../api/storyApi'

/**
 * Encapsulates the hidden file-input + Cloudinary upload + story creation flow
 * shared by DesktopStory and MobileStory.
 *
 * @param {Function} onStoryCreated - called with the new story object on success
 * @returns {{ fileInputRef, handleFileChange, openPicker }}
 *
 * Usage:
 *   const { fileInputRef, handleFileChange, openPicker } = useStoryUpload(onStoryCreated)
 *
 *   <input ref={fileInputRef} type="file" accept="image/*"
 *          style={{ display: 'none' }} onChange={handleFileChange} />
 *   <button onClick={openPicker}>Add story</button>
 */
export function useStoryUpload(onStoryCreated) {
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    e.target.value = '' // reset before async so the same file can be re-selected
    if (!file) return
    try {
      const { data: uploadData } = await uploadImageApi(file)
      const { data: storyData } = await createStoryApi(uploadData.data.url)
      onStoryCreated(storyData.data.story)
    } catch (err) {
      console.error('Story upload failed:', err)
    }
  }

  const openPicker = () => fileInputRef.current?.click()

  return { fileInputRef, handleFileChange, openPicker }
}
