import { StripePurchase } from "./stripeHelper.interfaces";
import { getAuth } from "firebase/auth";
import { API_PREFIX } from "../../app.constants";

const SUBSCRIPTIONS_ENDPOINT_BASE = API_PREFIX + "/subscriptions";
const CHECKOUT_ENDPOINT = `${SUBSCRIPTIONS_ENDPOINT_BASE}/createCheckoutSession`;
const PLAN_TYPE_KEY = "planType";
const USER_ID_KEY = "userId";
const ACCOUNT_MANAGEMENT_SESSION_ENDPOINT = `${SUBSCRIPTIONS_ENDPOINT_BASE}/manage`;
const PAYMENTS_ENDPOINT_BASE = API_PREFIX + "/payments";
const STRIPE_ENDPOINT_BASE = API_PREFIX + "/stripe";

export const checkout = async (userId: string, planType: string) => {
  if (planType !== MONTHLY_PLAN && planType !== ANNUAL_PLAN) {
    throw new Error(
      `planType is invalid, expecting: ${MONTHLY_PLAN} or ${ANNUAL_PLAN} but was ${planType}`
    );
  }
  return createCheckoutSession(planType);
};

const createCheckoutSession = async (planType: string) => {
  const user = getActiveUser();
  const userId = user.uid;
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(
    `${CHECKOUT_ENDPOINT}?${USER_ID_KEY}=${userId}&${PLAN_TYPE_KEY}=${planType}`,
    {
      method: "POST",
      headers: {
        authorization: tokenHeaderValue,
      },
    }
  );
  if (response.status !== 301) {
    throw new Error(response.statusText);
  }
  return response.json();
};

export const createCheckoutSessionForProduct = async (
  userId: string,
  priceId: string,
  templateId: string
) => {
  const body = {
    userId,
    priceId,
    templateId,
  };
  const response = await fetch(PAYMENTS_ENDPOINT_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (response.status !== 301) {
    throw new Error(response.statusText);
  }
  return response.json();
};

export const getAccountManagementPortalSession = async () => {
  const user = getActiveUser();
  const userId = user.uid;
  const token = await user.getIdToken();
  const tokenHeaderValue = getBearerTokenHeader(token);
  const response = await fetch(
    `${ACCOUNT_MANAGEMENT_SESSION_ENDPOINT}/${userId}`,
    {
      method: "POST",
      headers: {
        authorization: tokenHeaderValue,
      },
    }
  );
  const responseData = await response.json();
  return responseData.url;
};

export const getPurchasedTemplates = async (userId: string) => {
  const response = await fetch(`${STRIPE_ENDPOINT_BASE}/${userId}/purchases`, {
    method: "GET",
  });
  const allPurchases: Array<StripePurchase> = await response.json();
  return allPurchases.filter((purchase) => purchase.templateId != null);
};

export const MONTHLY_PLAN = "MONTHLY";
export const ANNUAL_PLAN = "ANNUAL";

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
