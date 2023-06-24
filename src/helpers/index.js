const { default: CurrencyAPI } = require("@everapi/currencyapi-js");

export const currencyApi = new CurrencyAPI(
  "NBI0ylmLGPyndahO92FNAJDLnTOEtS4wB7k9Sqxu"
);

export const clearEmpty = (obj) => {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === "object") {
        result[key] = clearEmpty(value);
      } else if (value !== null && value !== undefined && value !== "") {
        result[key] = value;
      }
    }
  }
  return result;
};
