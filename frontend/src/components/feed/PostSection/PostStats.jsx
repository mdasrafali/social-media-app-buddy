import ReactImage1 from "../../../assets/images/react_img1.png"
import ReactImage2 from "../../../assets/images/react_img2.png"
import ReactImage3 from "../../../assets/images/react_img3.png"
import ReactImage4 from "../../../assets/images/react_img4.png"
import ReactImage5 from "../../../assets/images/react_img5.png"


export default function PostStats({ likesCount, commentsCount, onLikesClick }) {
  return (
    <>
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div
          className="_feed_inner_timeline_total_reacts_image"
          onClick={likesCount > 0 ? onLikesClick : undefined}
          style={likesCount > 0 ? { cursor: 'pointer' } : undefined}
        >
          <img src={ReactImage1} alt="Image" className="_react_img1" />
          <img src={ReactImage2} alt="Image" className="_react_img" />
          <img src={ReactImage3} alt="Image" className="_react_img _rect_img_mbl_none" />
          <img src={ReactImage4} alt="Image" className="_react_img _rect_img_mbl_none" />
          <img src={ReactImage5} alt="Image" className="_react_img _rect_img_mbl_none" />
          <p className="_feed_inner_timeline_total_reacts_para">{likesCount}</p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <a href="#0">
              <span>{commentsCount}</span> Comment
            </a>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2">
            <span>0</span> Share
          </p>
        </div>
      </div>
    </>
  )
}
