import alembic from "../../assets/images/templates/alembic/alembic-splash.png";
import springfield from "../../assets/images/templates/springfield/springfield-splash.png";
import beautifulJekyll from "../../assets/images/templates/beautiful-jekyll/beautiful-jekyll-splash.png";
import minimalMistakes from "../../assets/images/templates/minimal-mistakes/minimal-mistakes-splash.png";
import hydeTheme from "../../assets/images/templates/hyde/hyde-splash.png";
import midgardTheme from "../../assets/images/templates/midgard/midgard-splash.png";

export interface ITemplate {
  name: string;
  key: string;
  splashPhoto: string;
  extraPhotos: Array<string>;
  description: string;
  features: Array<string>;
  previewLink: string;
  price?: number;
  priceId?: string;
}

let templateItems: ITemplate[];

templateItems = [
  {
    name: "Alembic",
    key: "alembic",
    splashPhoto: alembic,
    extraPhotos: [],
    description: "A simple, clean, and modern single page website.",
    features: [],
    previewLink: "https://resumecharge.gitlab.io/Alembic",
  },
  {
    name: "Springfield",
    key: "springfield",
    splashPhoto: springfield,
    extraPhotos: [],
    description:
      "A professional single page website that highlights your" +
      " achievements and experience.",
    features: [],
    previewLink: "https://resumecharge.gitlab.io/Springfield",
  },
  {
    name: "Midgard",
    key: "midgard",
    splashPhoto: midgardTheme,
    extraPhotos: [],
    description: "Awesome website",
    features: [],
    previewLink: "https://resumecharge.gitlab.io/Midgard",
  },
  {
    name: "Beautiful Jekyll",
    key: "beautiful-jekyll",
    splashPhoto: beautifulJekyll,
    extraPhotos: [],
    description:
      "Multi page website supporting separate sections for" +
      " work-experience, education, skills and more.",
    features: [],
    previewLink: "https://resumecharge.gitlab.io/BeautifulJekyll",
  },
  {
    name: "Minimal Mistakes",
    key: "minimal-mistakes",
    splashPhoto: minimalMistakes,
    extraPhotos: [],
    description: "Awesome website",
    features: [],
    previewLink: "https://resumecharge.gitlab.io/MinimalMistakes",
  },
  {
    name: "Hyde",
    key: "hyde",
    splashPhoto: hydeTheme,
    extraPhotos: [],
    description: "Awesome website",
    features: [],
    previewLink: "https://resumecharge.gitlab.io/Hyde",
  },
];

export default templateItems;
