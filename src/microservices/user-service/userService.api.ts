import { USER_ID, USERS_SERVICE_API } from "../../app.constants";

export interface IDbUser {
  userId: string;
  email: string;
  isEmailVerified: boolean;
  isActive: boolean;
  websiteIdentifier: string;
}

export interface IDbUserUpdate {
  githubToken: string;
}

const USERS_ENDPOINT = USERS_SERVICE_API + "/users";

export const getUser = async (): Promise<IDbUser | null> => {
  const response = await fetch(`${USERS_ENDPOINT}/${USER_ID}`, {
    method: "GET",
  });
  if (response.headers.get("content-length") !== "0") {
    const userResponse = await response.json();
    return {
      userId: userResponse.userId,
      email: userResponse.email,
      isEmailVerified: userResponse.isEmailVerified,
      isActive: userResponse.isActive,
      websiteIdentifier: userResponse.websiteIdentifier,
    };
  }
  return null;
};

export const hasValidGithubToken = async (): Promise<boolean> => {
  const response = await fetch(`${USERS_ENDPOINT}/${USER_ID}/token`, {
    method: "GET",
  });
  return response.status === 200;
};

export const updateUser = async (dbUser: IDbUserUpdate) => {
  const response = await fetch(`${USERS_ENDPOINT}/${USER_ID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dbUser),
  });
  if (response.status === 409) {
    throw new Error("Nickname already in use, please choose another nickname");
  }
  if (response.status !== 200) {
    throw new Error("Error saving nickname, please try again");
  }
  console.log(JSON.stringify(response));
  return response.json();
};
