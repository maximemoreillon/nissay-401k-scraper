import axios from "axios";

export const { FINANCES_API_URL, FINANCES_API_TOKEN, FINANCES_API_ACCOUNT_ID } =
  process.env;

export const register_valuation = (valuation: number) => {
  const url = `${FINANCES_API_URL}/accounts/${FINANCES_API_ACCOUNT_ID}/balance`;

  const body = {
    valuation,
    currency: "JPY",
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FINANCES_API_TOKEN}`,
    },
    timeout: 3000,
  };

  return axios.post(url, body, options);
};
