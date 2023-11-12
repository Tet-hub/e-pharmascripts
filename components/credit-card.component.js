import React from "react";
import { LiteCreditCardInput } from "react-native-credit-card-input";
import { cardTokenRequest } from "../service/checkout.service";
import { getCurrentCustomerName } from "../src/authToken";

export const CreditCardInput = ({ name, onSuccess }) => {
  const onChange = async (formData) => {
    const { values, status } = formData;
    const isInComplete = Object.values(status).includes("incomplete");
    console.log(isInComplete);
    const expiry = values.expiry.split("/");
    console.log(expiry);
    const card = {
      number: values.number,
      exp_month: expiry[0],
      exp_year: expiry[1],
      cvc: "244",
      name: name,
    };
    try {
      if (!isInComplete) {
        const info = await cardTokenRequest(card);
        onSuccess(info);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <LiteCreditCardInput onChange={onChange} />;
};
