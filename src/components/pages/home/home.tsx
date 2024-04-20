import { useEffect } from "react";
import Header from "../../navigation/header/header";
import "./home.scss";
import { useNavigate } from "react-router-dom";
import MainImage from "../../../assets/images/home/home-main-image.png";
import {
  CloudServer,
  Domain,
  GithubLogo,
  HTML,
  NoContract,
  Templates,
} from "../../../assets/images/home/featuresIcons";
import Typewriter from "typewriter-effect";
import Footer from "../../navigation/footer/footer";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useAppSelector } from "../../../store/hooks";
import { getUser } from "../../../store/reducers/userSlice";

function Home() {
  const user = useAppSelector(getUser);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser && user.isSignedIn) {
      navigate("/account");
    }
  }, [auth.currentUser, navigate, user.isSignedIn]);

  function getTypewriter() {
    const typewriterStrings = [
      "Software Engineers",
      "Marketing Pros",
      "Content Creators",
      "Freelancers",
      "Web Developers",
    ];

    return (
      <Typewriter
        options={{
          strings: typewriterStrings,
          autoStart: true,
          loop: true,
          deleteSpeed: 50,
          delay: 100,
        }}
      />
    );
  }

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users`).then((res) => {});
  });

  return (
    <div>
      <div className={"home_container"}>
        <Header />
        <div className={"home_main_banner"}>
          <div className={"home_main_tagline"}>
            <h1>Turn Your Resume Into a Website in Minutes</h1>
          </div>
          <p className={"home-typewriter-text"}>Impressive Websites For: </p>
          <div className={"home-typewriter-text"}>
            <span>{getTypewriter()}</span>
          </div>
          <div className={"home_main_banner_button"}>
            <button
              className={"home_create_website"}
              onClick={() => navigate("/signin")}
            >
              Create My Website Now
            </button>
          </div>
          <div className={"home_banner_image"}>
            <img src={MainImage} />
          </div>
        </div>

        <div className={"home_main_subheading"}>
          <h1>The fastest way to turn your resume into a website</h1>
          <p>Stand out. Get noticed. Get hired.</p>
          <button
            className={"home_create_website"}
            onClick={() => navigate("/signin")}
          >
            Create My Website Now
          </button>
        </div>
        <div className={"home_features_section"}>
          <h1>Features You Want</h1>
          <div className={"home_features_grid"}>
            <div className={"home_features_item"}>
              <h1>Easy To Use</h1>
              <p>
                Beautiful templates make it easy to deploy a beautiful and
                modern resume website in minutes
              </p>
            </div>
            <div className={"home_features_item"}>
              <h1>Blazing Fast</h1>
              <p>
                Get up and running in a matter of minutes. Changes take minutes,
                not hours.
              </p>
            </div>
            <div className={"home_features_item"}>
              <h1>Power User Support</h1>
              <p>
                With the option to deploy to your Github Account, you can tweak,
                modify, and change to your heart's content
              </p>
            </div>
            <div className={"home_features_item"}>
              <h1>Personalized Domain</h1>
              <p>All websites include a free domain for easy sharing.</p>
            </div>
            <div className={"home_features_item"}>
              <h1>Simple Terms And Pricing</h1>
              <p>
                Take your website anywhere with complete and total ownership of
                the source code. No lock-ins or restrictive licenses here.
              </p>
            </div>
            <div className={"home_features_item"}>
              <h1>Safe, Secure, And Fast</h1>
              <p>
                Powered by GitHub, AWS, and Jekyll, your website is built,
                deployed, and hosted using the most trusted technologies on the
                web.
              </p>
              <div className={"home_features_item_multi_image_container"}></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
