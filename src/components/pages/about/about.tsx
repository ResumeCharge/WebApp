import React from "react";
import Header from "../../navigation/header/header";
import Choice from "../../../assets/images/about/choice.svg";
import Resume from "../../../assets/images/about/resume.svg";
import Deploy from "../../../assets/images/about/deployment.svg";
import Celebrate from "../../../assets/images/about/website-deployed.svg";
import "./about.scss";
import confetti from "canvas-confetti";
import Footer from "../../navigation/footer/footer";

type FadeInSectionProps = {
  children: JSX.Element;
};

function FadeInSection(props: FadeInSectionProps) {
  const [isVisible, setVisible] = React.useState(false);
  const domRef = React.useRef(null);
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      });
    });
    if (domRef.current) {
      observer.observe(domRef.current);
    }
  }, []);
  return (
    <div
      className={`fade-in-section ${isVisible ? "is-visible" : ""}`}
      ref={domRef}
    >
      {props.children}
    </div>
  );
}

function About() {
  return (
    <div>
      <div className={"about_container"}>
        <Header />
        <div className={"about_main_banner"}>
          <h1>
            Giving Everyone The Power To Quickly And Easily Create A Custom
            Resume Website
          </h1>
          <p>
            From business professionals, to freelance developers and everyone in
            between, we know job hunting is hard. You spend countless hours
            sending emails and applying to jobs only to never receive a call
            back. Having a personal website allows you to turn more of those
            emails and applications into opportunities. A resume can only say so
            much about you, say more by having your skills and talents on the
            web for the world to see.
          </p>
          <button>Create My Website Now</button>
        </div>
        <div className={"about_content_subsection_tiles"}>
          <FadeInSection>
            <div className={"about_content_subsection_dark"}>
              <h1>A website in minutes, not hours</h1>
              <p>
                You’ve spent hours creating the perfect resume to help you get
                hired, so why not turn all that effort into a website? Unlike
                other website creation sites, we don’t have complicated user
                interfaces or website builders. You don’t need to be tech genius
                or a visual design pro to get a website that looks good and
                performs great across all devices. What takes hours with our
                competitors takes minutes with us.
              </p>
            </div>
          </FadeInSection>
          <FadeInSection>
            <div className={"about_content_subsection_light"}>
              <h1>Unmatched Flexibility</h1>
              <p>
                No restrictive licenses or scary contracts to sign. Zero. Nada.
                Zilch. From the very moment you create your website you own it
                in its entirety, forever. When you use other website creation
                tools they own your content and your ideas. They can take down
                your website, sell it to others, or force you to make changes
                you don’t want. At Resume Charge, you can do whatever you want
                with your website. Want to host it somewhere else? Awesome! Want
                to share your source code with a friend? Do it!
              </p>
            </div>
          </FadeInSection>
          <FadeInSection>
            <div className={"about_content_subsection_dark"}>
              <h1>Built With Technologies You Love</h1>
              <p>
                Built with the most most trusted technologies including Github,
                Stripe, Amazon Web Services (AWS), Jekyll and more. The same
                technologies used by companies around the globe to service
                billions of users are used right here to power your website.
              </p>
            </div>
          </FadeInSection>
        </div>
        <FadeInSection>
          <div className={"about_content_subsection_workflow"}>
            <h1>Getting started with Resume Charge</h1>
            <div className={"workflow_steps_list"}>
              <ol>
                <FadeInSection>
                  <div className={"workflow_steps_item"}>
                    <h1>1. Enter your resume details</h1>
                    <p>Tell us about your career, education, skills and more</p>
                    <img src={Resume} />
                  </div>
                </FadeInSection>
                <FadeInSection>
                  <div className={"workflow_steps_item"}>
                    <h1>2. Choose a template</h1>
                    <p>Pick from many beautiful website templates</p>
                    <img src={Choice} />
                  </div>
                </FadeInSection>
                <FadeInSection>
                  <div className={"workflow_steps_item"}>
                    <h1>3. Deploy your website</h1>
                    <p>Sit back and relax while we deploy your website</p>
                    <img src={Deploy} />
                  </div>
                </FadeInSection>
                <FadeInSection>
                  <div className={"workflow_steps_item"}>
                    <h1>4. Enjoy your new home on the web</h1>
                    <p>
                      Your new website with free hosting and full ownership is
                      ready for the world to see
                    </p>
                    <img src={Celebrate} />
                    <p
                      className={"confetti_launcher_button"}
                      onClick={() =>
                        confetti({ particleCount: 1000, spread: 200 })
                      }
                    >
                      🎉🎉🎉🎉🎉
                    </p>
                  </div>
                </FadeInSection>
              </ol>
            </div>
            <div className={"about_get_started"}>
              <h1>Get Started Now</h1>
              <button className={"about_create_website"}>
                Create My Website Now
              </button>
            </div>
          </div>
        </FadeInSection>
      </div>
      <Footer />
    </div>
  );
}

export default About;
