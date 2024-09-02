export interface FaqItem {
  title: string;
  content: string;
}

let faqItems: FaqItem[];

faqItems = [
  {
    title: "Is Resume Charge Free?",
    content:
      "Yes! ResumeCharge is offered as a free service to allow people to easily create " +
      "beautiful websites that highlight their skills and expertise.",
  },
  {
    title: "Why Is Resume Charge Free?",
    content:
      "ResumeCharge is a passion project of mine and was started to give people an alternative to " +
      "the large established website builder products and companies. I wanted to create something that gave you complete " +
      "ownership of your website without vendor lock-ins or contracts, while being powered by open-source technologies.",
  },
  {
    title: "Will ResumeCharge always be free?",
    content:
      "The standalone alone version of ResumeCharge (that you are using right now!) will always be free. " +
      "I may decide to offer a hosted version with some paid features down the line, but the features in the initial " +
      "release of the standalone will always be free.",
  },
  {
    title: "Is my GitHub Access Token Secure?",
    content:
      "Yes, your token is encrypted and stored in the local Postgres database running in an isolated Docker container." +
      " However, we do not recommend exposing " +
      "the ResumeCharge instance to the public internet. The standalone version of ResumeCharge is designed to run " +
      "in an isolated Docker environment that is not accessible from the public internet.",
  },
  {
    title: "Do You Sell My Data?",
    content:
      "Nope, the standalone version of ResumeCharge runs entirely on your local machine, the only calls to external " +
      "services are calls to the GitHub API for deploying your GitHub pages website.",
  },
  {
    title: "Is ResumeCharge open-source?",
    content:
      "Yes! View our source code at <a href='https://github.com/orgs/ResumeCharge/repositories' target='_blank'>" +
      "github.com/orgs/ResumeCharge/repositories</a>",
  },
  {
    title: "How Does Resume Charge Work?",
    content:
      "Getting your own website with Resume Charge is done in 4 simple steps:<br/>" +
      "1. Enter your resume details<br/> 2. Choose a template<br/> 3. Deploy your website<br/>" +
      "4. Enjoy your new home on the web\n",
  },
  {
    title: "Can I use other providers like Netlify?",
    content:
      "Yes! Although we don't support deploying directly to other providers at the moment," +
      " you can take your website anywhere. Your website lives in your Github repository, meaning you own the source code" +
      " and can do whatever you like with it." +
      " We are currently working on integrating" +
      " with additional hosting providers.",
  },
  {
    title: "Do I get my own domain for my website?",
    content:
      "<h3>Yes! Your domain is provided by GitHub and uses your GitHub username.</h3>" +
      "<a href='https://github-username.github.io' target='_blank'>&lt;github-username&gt;.github.io</a>",
  },
  {
    title: "Can I use a domain I already own?",
    content:
      "Custom domains are currently supported for GitHub deployments: " +
      "https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages ",
  },
  {
    title: "Do I really own the website I create with Resume Charge?",
    content:
      "Yes! By creating a website with your personal GitHub account you have total control over it. " +
      "Change as much or as little of your website as you want, it's up to you!",
  },
];

export default faqItems;
