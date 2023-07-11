const { default: CurrencyAPI } = require("@everapi/currencyapi-js");

export const currencyApi = new CurrencyAPI(
  "NBI0ylmLGPyndahO92FNAJDLnTOEtS4wB7k9Sqxu"
);

export const clearEmpty = (obj) => {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === "object" && !Array.isArray(value)) {
        const clearedValue = clearEmpty(value);

        if (!!Object.keys(clearedValue).length) {
          result[key] = clearedValue;
        }
      } else if (
        (Array.isArray(value) && value.length !== 0) ||
        (value !== null && value !== undefined && value !== "")
      ) {
        result[key] = value;
      }
    }
  }
  return result;
};
