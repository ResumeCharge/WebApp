import onlineCv from "../../../assets/images/templates/online-cv/online-cv-splash.png";

interface ITemplate {
  name: string;
  key: string;
  pathToPhoto: string;
  description: string;
}

let templateItems: ITemplate[];

templateItems = [
  {
    name: "Alembic",
    key: "alembic",
    pathToPhoto: onlineCv,
    description: "Awesome website",
  },
  {
    name: "Online CV",
    key: "online-cv1",
    pathToPhoto: onlineCv,
    description: "Awesome website",
  },
  {
    name: "Online CV",
    key: "online-cv",
    pathToPhoto: onlineCv,
    description: "Awesome website",
  },
  {
    name: "Online CV",
    key: "online-cv",
    pathToPhoto: onlineCv,
    description: "Awesome website",
  },
  {
    name: "Online CV",
    key: "online-cv",
    pathToPhoto: onlineCv,
    description: "Awesome website",
  },
];

export default templateItems;
