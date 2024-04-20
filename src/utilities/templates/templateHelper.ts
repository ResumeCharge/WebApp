import { getAvailableTemplates as getTemplatesFromDb } from "../../microservices/deployment-service/deploymentService.api";
import templateItems from "./templateItems";

export const getAvailableTemplates = async () => {
  const dbTemplates = await getTemplatesFromDb();
  const matches = templateItems.filter((template) => {
    const hasMatch = dbTemplates.find(
      (dbTemplate) => dbTemplate._id === template.key
    );
    return !!hasMatch;
  });
  return matches.map((template) => {
    const dbTemplate = dbTemplates.find(
      (dbTemplate) => dbTemplate._id === template.key
    );
    // @ts-ignore
    template.price = dbTemplate.price;
    // @ts-ignore
    template.priceId = dbTemplate.priceId;
    return template;
  });
};

export const getLocalTemplates = () => {
  return templateItems;
};
