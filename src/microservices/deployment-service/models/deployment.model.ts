export interface IDeployment {
  websiteDetails: IWebsiteDetails;
  resumeId: string;
  userId: string;
  templateId: string;
  deploymentProvider: string;
}

export interface IWebsiteDetails {
  title: string;
  description: string;
  extraConfigurationOptions?: Map<string, any>;
  resumeDocument?: string;
  profilePicture?: string;
}
