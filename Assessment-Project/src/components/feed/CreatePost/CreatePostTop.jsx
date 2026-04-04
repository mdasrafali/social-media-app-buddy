import { useAuth } from '../../../context/AuthContext'

export default function CreatePostTop({ content, setContent }) {
  const { user } = useAuth()
  const avatarSrc = user?.avatar || 'assets/images/txt_img.png'

  return (
    <>
      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          <img src={avatarSrc} alt="Image" className="_txt_img" />
        </div>
        <div className="form-floating _feed_inner_text_area_box_form ">
          <textarea
            className="form-control _textarea"
            placeholder="Leave a comment here"
            id="floatingTextarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <label className="_feed_textarea_label" htmlFor="floatingTextarea">
            Write something ...
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" fill="none" viewBox="0 0 23 24">
              <path fill="#666" d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z" />
            </svg>
          </label>
        </div>
      </div>
    </>
  )
}
