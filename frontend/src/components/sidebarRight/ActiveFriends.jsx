import ActiveFriendItem from "./ActiveFriendItem";
import ActiveFriendsHeader from "./ActiveFriendsHeader";

import People1 from "../../assets/images/people1.png";
import People2 from "../../assets/images/people2.png";
import People3 from "../../assets/images/people3.png";

const FRIENDS = [
  {
    image: People1,
    name: "Steve Jobs",
    role: "CEO of Apple",
    status: "inactive",
    time: "5 minute ago",
  },
  {
    image: People2,
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    status: "active",
  },
  {
    image: People3,
    name: "Dylan Field",
    role: "CEO of Figma",
    status: "active",
  },
  {
    image: People1,
    name: "Steve Jobs",
    role: "CEO of Apple",
    status: "inactive",
    time: "10 minute ago",
  },
  {
    image: People2,
    name: "Ryan Roslansky",
    role: "CEO of Linkedin",
    status: "active",
  },
  {
    image: People3,
    name: "Dylan Field",
    role: "CEO of Figma",
    status: "active",
  },
];

export default function ActiveFriends() {
  return (
    <>
      <div className="_layout_right_sidebar_inner">
        <div className="_feed_right_inner_area_card  _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <ActiveFriendsHeader />
          <div className="_feed_bottom_fixed">
            {FRIENDS.map((friend, index) => (
              <ActiveFriendItem
                key={index}
                image={friend.image}
                name={friend.name}
                role={friend.role}
                status={friend.status}
                time={friend.time}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
