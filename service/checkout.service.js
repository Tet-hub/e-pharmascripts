import createStripe from "stripe-client";
import { PAYMENT_URL } from "../src/api/apiURL";

const stripe = createStripe(
  "pk_test_51OBNGQDworiCObXjxveoTudRjyCJpgRVS9D5eeFtO7NcHw8zBhD9BrCAbcrNnv3zfuK9QsV8yJmlrJtY6sgVHe3U001CuA7Cej"
);

export const cardTokenRequest = (card) => stripe.createToken({ card });

export const payRequest = (token, amount, name) => {
  return fetch(`${PAYMENT_URL}/pay`, {
    body: JSON.stringify({
      token,
      name,
      amount,
    }),
    method: "POST",
  }).then((res) => {
    if (res.status > 200) {
      return Promise.reject("Something went wrong in processing payments");
    }
    return res.json();
  });
};
