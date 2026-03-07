import axios from "axios";

export const { FINANCES_API_URL, FINANCES_API_TOKEN, FINANCES_API_ACCOUNT_ID } =
  process.env;

export const register = (balance: number) => {
  const url = `${FINANCES_API_URL}/accounts/${FINANCES_API_ACCOUNT_ID}/balance`;

  const body = {
    balance,
    currency: "JPY",
  };

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (FINANCES_API_TOKEN)
    headers.Authorization = `Bearer ${FINANCES_API_TOKEN}`;

  return axios.post(url, body, { headers });
};
