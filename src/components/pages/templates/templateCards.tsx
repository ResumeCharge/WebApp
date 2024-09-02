import React, { useEffect, useState } from "react";
import "./templates.scss";
import { ITemplate } from "../../../utilities/templates/templateItems";
import { getLocalTemplates } from "../../../utilities/templates/templateHelper";
import { Skeleton } from "@mui/material";

interface IGetWebsiteTemplateCardsProps {
  onDeploy?(templateId: string): void;

  onSeeMore?(templateId: string): void;

  onCardClick?(templateId: string): void;

  isDeploying?: boolean;
  templates: Array<ITemplate>;
}

interface ITemplateCardsProps {
  onDeploy?(templateId: string): void;

  onSeeMore?(templateId: string): void;

  onCardClick?(templateId: string): void;

  isDeploying?: boolean;
}

const getWebsiteTemplateCards = async (
  props: IGetWebsiteTemplateCardsProps
) => {
  const handleOnDeploy = (templateId: string) => {
    if (props.onDeploy) {
      props.onDeploy(templateId);
    }
  };

  const handleSeeMoreClick = (previewLink: string) => {
    if (props.onSeeMore) {
      props.onSeeMore(previewLink);
    } else {
      window.open(previewLink);
    }
  };

  const handleCardClick = (templateId: string) => {
    if (props.onCardClick) {
      props.onCardClick(templateId);
    }
  };

  interface imageTemplateKeyValuePair {
    image: HTMLElement;
    key: string;
  }

  const splashImagesPromises: Promise<imageTemplateKeyValuePair>[] = [];
  props.templates.forEach((template) => {
    const imgPromise = new Promise<imageTemplateKeyValuePair>(
      (resolve, reject) => {
        const img = new Image();
        const kvp: imageTemplateKeyValuePair = {
          key: template.key,
          image: img,
        };
        img.onload = () => resolve(kvp);
        img.onerror = reject;
        img.src = template.splashPhoto;
      }
    );
    splashImagesPromises.push(imgPromise);
  });
  const splashImagesArray = await Promise.all(splashImagesPromises.values());
  const splashImages = new Map<string, HTMLElement>();
  splashImagesArray.forEach((kvp) => {
    splashImages.set(kvp.key, kvp.image);
  });

  return (
    <div className={"templates_list_content"}>
      <ul className={"templates_list"}>
        {props.templates.map((websiteTemplate) => {
          return (
            <li
              key={websiteTemplate.name}
              onClick={() => handleCardClick(websiteTemplate.key)}
            >
              <h1 className={"template_title"}>{websiteTemplate.name}</h1>
              <div className={"template_card_item"}>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      splashImages.get(websiteTemplate.key)?.outerHTML ?? "",
                  }}
                />
                <div className={"template_list_item_button_container"}>
                  {props.isDeploying ? (
                    <button
                      className={"template_deploy"}
                      onClick={() => handleOnDeploy(websiteTemplate.key)}
                    >
                      Deploy This Template
                    </button>
                  ) : null}
                  <button
                    className={"template_see_more"}
                    onClick={() =>
                      handleSeeMoreClick(websiteTemplate.previewLink)
                    }
                  >
                    Preview
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const getWebsiteTemplatesSkeletons = () => {
  const skeletons = 6;
  return (
    <div className={"templates_list_content_skeleton"}>
      <ul className={"templates_list_skeleton"}>
        {[...Array(skeletons)].map((e, i) => (
          <li key={i}>
            <div className={"template_card_item_skeleton"}>
              <Skeleton
                variant="rectangular"
                height={600}
                width={500}
                className={"template_skeleton"}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

function TemplateCards(props: ITemplateCardsProps) {
  const [websiteTemplateCards, setWebsiteTemplateCards] =
    useState<JSX.Element | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (websiteTemplateCards) {
      return;
    }
    const templates = getLocalTemplates();
    getWebsiteTemplateCards({
      templates,
      isDeploying: props.isDeploying,
      onSeeMore: props.onSeeMore,
      onDeploy: props.onDeploy,
      onCardClick: props.onCardClick,
    }).then((cards) => {
      setWebsiteTemplateCards(cards);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className={"templates_container"}>
      {isLoading ? getWebsiteTemplatesSkeletons() : websiteTemplateCards}
    </div>
  );
}

export default TemplateCards;
