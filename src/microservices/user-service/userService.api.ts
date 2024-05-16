import { getAuth } from "firebase/auth";
import { API_PREFIX } from "../../app.constants";

export interface IDbUser {
  userId: string;
  email: string;
  isEmailVerified: boolean;
  isActive: boolean;
  websiteIdentifier: string;
}

export interface IDbUserUpdate {
  websiteIdentifier?: string;
  isEmailVerified?: boolean;
}

const USERS_ENDPOINT = API_PREFIX + "/users";

export const getUser = async (): Promise<IDbUser | null> => {
  const user = getActiveUser();
  const userId = user.uid;
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "GET",
    headers: {
      authorization: tokenHeaderValue,
    },
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

export const saveUser = async () => {
  const user = getActiveUser();
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(`${USERS_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: tokenHeaderValue,
    },
    body: JSON.stringify({
      userId: user.uid,
      email: user.email,
    }),
  });
  if (response.status !== 201) {
    throw new Error("Unable to save user");
  }
  return response.json();
};

export const hasValidGithubToken = async (): Promise<boolean> => {
  const user = getActiveUser();
  const userId = user.uid;
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(`${USERS_ENDPOINT}/${userId}/token`, {
    method: "GET",
    headers: {
      authorization: tokenHeaderValue,
    },
  });
  return response.status === 200;
};

export const updateUser = async (dbUser: IDbUserUpdate) => {
  const user = getActiveUser();
  const userId = user.uid;
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: tokenHeaderValue,
    },
    body: JSON.stringify(dbUser),
  });
  if (response.status === 409) {
    throw new Error("Nickname already in use, please choose another nickname");
  }
  if (response.status !== 200) {
    throw new Error("Error saving nickname, please try again");
  }
  return response.json();
};

const getActiveUser = () => {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error("No active user, unable to getUser");
  }
  return auth.currentUser;
};

const getBearerTokenHeader = (token: string) => {
  return "Bearer " + token;
};
