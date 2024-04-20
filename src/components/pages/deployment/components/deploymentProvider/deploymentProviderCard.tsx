import "./deploymentProviderCard.scss";

interface IProps {
  title: string;
  image: string;
  onClick(): void;
}

export default function DeploymentProviderCard(props: IProps) {
  return (
    <div className={`deployment_provider_card`}>
      <h1 className={"deployment_provider_card_title"}>{props.title}</h1>
      <img src={props.image} alt={"deployment provider"} />
      <button onClick={props.onClick}>Select</button>
    </div>
  );
}
