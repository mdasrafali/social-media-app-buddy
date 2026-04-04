import EventItem from "./EventItem";
import EventImage from '../../assets/images/feed_event1.png'

const EVENTS = [
  { image: EventImage, eventName: "No more terrorism no more cry", date: "10", month: "Jul", going: "17 People Going" },
  { image: EventImage, eventName: "Global Tech Summit 2025", date: "25", month: "Aug", going: "42 People Going" },
];

export default function EventsList() {
  return (
    <>
      <div className="_layout_left_sidebar_inner">
        <div className="_left_inner_area_event _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
          <div className="_left_inner_event_content">
            <h4 className="_left_inner_event_title _title5">Events</h4>
            <a href="#0" className="_left_inner_event_link">
              See all
            </a>
          </div>

          {EVENTS.map((event) => (
            <EventItem
              key={event.eventName}
              ImageLink={event.image}
              eventName={event.eventName}
              date={event.date}
              month={event.month}
              going={event.going}
            />
          ))}
        </div>
      </div>
    </>
  );
}
