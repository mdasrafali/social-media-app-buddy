import { useState } from 'react'
import { createPostApi } from '../../../api/postApi'
import { uploadImageApi } from '../../../api/uploadApi'
import CreatePostActionsDesktop from './CreatePostActionsDesktop'
import CreatePostActionsMobile from './CreatePostActionsMobile'
import CreatePostTop from './CreatePostTop'

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)      // raw File object
  const [imagePreview, setImagePreview] = useState(null) // local blob URL for preview
  const [visibility, setVisibility] = useState('public')
  const [uploading, setUploading] = useState(false)
  const [posting, setPosting] = useState(false)

  const handleImageSelect = (file) => {
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file)) // instant local preview
  }

  const clearImage = () => {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
  }

  const handlePost = async () => {
    if (!content.trim() && !imageFile) return
    setPosting(true)
    try {
      let imageUrl = null

      // If an image was selected, upload to Cloudinary first
      if (imageFile) {
        setUploading(true)
        const { data } = await uploadImageApi(imageFile)
        imageUrl = data.data.url
        setUploading(false)
      }

      const payload = { visibility }
      if (content.trim()) payload.content = content.trim()
      if (imageUrl) payload.imageUrl = imageUrl

      const { data } = await createPostApi(payload)
      onPostCreated(data.data.post)
      setContent('')
      clearImage()
    } catch (err) {
      console.error('Post failed:', err)
      setUploading(false)
    } finally {
      setPosting(false)
    }
  }

  const busy = posting || uploading
  const statusLabel = uploading ? 'Uploading...' : posting ? 'Posting...' : 'Post'

  return (
    <>
      <div className="_feed_inner_text_area  _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
        <CreatePostTop content={content} setContent={setContent} />

        {/* Image preview with remove button */}
        {imagePreview && (
          <div style={{ position: 'relative', margin: '8px 0' }}>
            <img
              src={imagePreview}
              alt="preview"
              style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: '6px' }}
            />
            <button
              onClick={clearImage}
              style={{
                position: 'absolute', top: 6, right: 6,
                background: 'rgba(0,0,0,0.55)', color: '#fff',
                border: 'none', borderRadius: '50%',
                width: 26, height: 26, cursor: 'pointer', fontSize: 14,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Visibility toggle */}
        <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
          <button
            type="button"
            onClick={() => setVisibility('public')}
            className={`_feed_inner_text_area_bottom_photo_link${visibility === 'public' ? ' _feed_reaction_active' : ''}`}
            style={{ fontSize: '13px', padding: '4px 12px', borderRadius: '4px', opacity: visibility === 'public' ? 1 : 0.5 }}
          >
            🌐 Public
          </button>
          <button
            type="button"
            onClick={() => setVisibility('private')}
            className={`_feed_inner_text_area_bottom_photo_link${visibility === 'private' ? ' _feed_reaction_active' : ''}`}
            style={{ fontSize: '13px', padding: '4px 12px', borderRadius: '4px', opacity: visibility === 'private' ? 1 : 0.5 }}
          >
            🔒 Only me
          </button>
        </div>

        <CreatePostActionsDesktop
          onPost={handlePost}
          posting={busy}
          statusLabel={statusLabel}
          onImageSelect={handleImageSelect}
        />
        <CreatePostActionsMobile
          onPost={handlePost}
          posting={busy}
          statusLabel={statusLabel}
          onImageSelect={handleImageSelect}
        />
      </div>
    </>
  )
}
