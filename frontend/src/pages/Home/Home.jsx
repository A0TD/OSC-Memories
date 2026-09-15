import { Link } from "react-router-dom";
import homecss from "./Home.module.css";
import calender from "../../assets/images/icons8-calender-85.png";
import photo from "../../assets/images/icons8-photo-48.png";
import people from "../../assets/images/icons8-people-48.png";
import star from "../../assets/images/icons8-star-50.png";

const features = [
  {
    icon: calender,
    title: "Seasons",
    desc: "Explore all OSC seasons and their highlights.",
  },
  {
    icon: star,
    title: "Events",
    desc: "Discover events that brought us together.",
  },
  {
    icon: photo,
    title: "Memories",
    desc: "Photos and videos that we'll always remember.",
  },
  {
    icon: people,
    title: "Members",
    desc: "Meet the amazing people behind OSC.",
  },
];

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
          <Link to="/eventinfo" className={homecss.eventBtn}>
            Explore Events
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
          {features.map((item, index) => (
            <div className={homecss.feature_card} key={index}>
              <div className={homecss.icon}>
                <img src={item.icon} alt="" aria-hidden="true" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
