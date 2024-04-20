import { v4 as uuidv4 } from "uuid";
import {
  GITHUB_OAUTH_ENDPOINT_CLIENT_ID_PARAMETER_KEY,
  GITHUB_OAUTH_ENDPOINT_CLIENT_ID_PARAMETER_VALUE,
  GITHUB_OAUTH_ENDPOINT_SCOPE_PARAMETER_KEY,
  GITHUB_OAUTH_ENDPOINT_SCOPE_PARAMETER_VALUE,
  GITHUB_OAUTH_ENDPOINT_STATE_PARAMETER_KEY,
} from "./githubServiceConstants";
import { getAuth } from "firebase/auth";
import { API_PREFIX } from "../../app.constants";

const GITHUB_AUTHORIZE_ENDPOINT = "https://github.com/login/oauth/authorize?";
const GITHUB_AUTH_COOKIE_EXPIRY_SECONDS = 3600;
const GITHUB_AUTH_COOKIE_KEY = "github-auth-cookie";

export const getGithubAuthEndpoint = (): string => {
  const state = uuidv4();
  setGithubAuthCookie(state, GITHUB_AUTH_COOKIE_EXPIRY_SECONDS);
  return (
    `${GITHUB_AUTHORIZE_ENDPOINT}` +
    `${GITHUB_OAUTH_ENDPOINT_CLIENT_ID_PARAMETER_KEY}=${GITHUB_OAUTH_ENDPOINT_CLIENT_ID_PARAMETER_VALUE}&` +
    `${GITHUB_OAUTH_ENDPOINT_SCOPE_PARAMETER_KEY}=${GITHUB_OAUTH_ENDPOINT_SCOPE_PARAMETER_VALUE}&` +
    `${GITHUB_OAUTH_ENDPOINT_STATE_PARAMETER_KEY}=${state}`
  );
};

const getGithubAuthCookie = () => {
  const allCookies = document.cookie;
  const cookieItemsArray = allCookies.split(";");
  const gitHubTokenCookies = cookieItemsArray.filter((item) =>
    item.trim().startsWith(GITHUB_AUTH_COOKIE_KEY)
  );
  if (gitHubTokenCookies.length !== 1) {
    throw new Error("Could not find github cookie in the list of cookies");
  }
  return gitHubTokenCookies[0].trim();
};

export const getStateFromGithubAuthCookie = () => {
  try {
    const githubAuthCookie = getGithubAuthCookie();
    const githubCookieKeyValuePairArray = githubAuthCookie.split("=");
    if (githubCookieKeyValuePairArray.length !== 2) {
      throw new Error(
        "Github auth cookie improperly formatted, must be of format key=value"
      );
    }
    if (githubCookieKeyValuePairArray[0] !== GITHUB_AUTH_COOKIE_KEY) {
      throw new Error(
        `Github auth cookie key invalid, must be ${GITHUB_AUTH_COOKIE_KEY}`
      );
    }
    return githubCookieKeyValuePairArray[1];
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const setGithubAuthCookie = (
  state: string,
  secondsUntilExpiry: number
) => {
  document.cookie = `${GITHUB_AUTH_COOKIE_KEY}=;expires=Thu,01 Jan 1970 00:00:01 GMT`;
  document.cookie = `${GITHUB_AUTH_COOKIE_KEY}=${state};max-age=${secondsUntilExpiry};SameSite=Lax`;
};

export const saveTokenToUserAccount = async (
  code: string,
  state: string,
  userId: string
) => {
  if (state !== getStateFromGithubAuthCookie()) {
    return;
  }
  const user = getActiveUser();
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(`${API_PREFIX}/users/${userId}/code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: tokenHeaderValue,
    },
    body: JSON.stringify({ code }),
  });
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
