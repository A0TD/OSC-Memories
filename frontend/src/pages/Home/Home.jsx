import { Link } from "react-router-dom";
import homecss from "./Home.module.css";
import calender from "../../assets/icons8-calender-85.png";
import photo from "../../assets/icons8-photo-48.png";
import people from "../../assets/icons8-people-48.png";
import star from "../../assets/icons8-star-50.png";
function Home() {
  return (
    <>
      <section className={homecss.home}>
        <h1>Welcome to OSC</h1>
        <h2>MEMORIES</h2>
        <span></span>
        <p>
          Capturing the laughter and milestones we built together, so you can
          relive every season, event, and unforgettable memory—all in one place.
        </p>
        <div>
          <Link to="/seasons" className={homecss.seasonBtn}>
            Explore Seasons
          </Link>
          <Link to="/events" className={homecss.eventBtn}>
            About Events
          </Link>
        </div>
      </section>
      <section className={homecss.about_sec}>
        <div className={homecss.about_left}>
          <span className={homecss.subtitle}>ABOUT OSC MEMORIES</span>
          <h2>
            More than events, <br />
            it's <span>our story.</span>
          </h2>
          <p>
            OSC Memories is a platform that brings together all our seasons,
            events, photos, and unforgettable moments. Built by us, for us.
          </p>
        </div>

        <div className={homecss.about_right}>
          <div className={homecss.feature_card}>
            <div className={homecss.icon}>
              <img src={calender} alt="season-photo" />
            </div>
            <h3>Seasons</h3>
            <p>Explore all OSC seasons and their highlights.</p>
          </div>

          <div className={homecss.feature_card}>
            <div className={homecss.icon}>
              <img src={star} alt="event-photo" />
            </div>
            <h3>Events</h3>
            <p>Discover events that brought us together.</p>
          </div>

          <div className={homecss.feature_card}>
            <div className={homecss.icon}>
              <img src={photo} alt="memory-photo" />
            </div>
            <h3>Memories</h3>
            <p>Photos and videos that we'll always remember.</p>
          </div>

          <div className={homecss.feature_card}>
            <div className={homecss.icon}>
              <img src={people} alt="member-photo" />
            </div>
            <h3>Members</h3>
            <p>Meet the amazing people behind OSC.</p>
          </div>
        </div>
      </section>
    </>
  );
}
export default Home;
