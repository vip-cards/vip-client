import { isEmpty, matches, pickBy } from "lodash";

const { default: CurrencyAPI } = require("@everapi/currencyapi-js");

export const currencyApi = new CurrencyAPI(
  "NBI0ylmLGPyndahO92FNAJDLnTOEtS4wB7k9Sqxu"
);

export const clearEmpty = (obj) => pickBy(obj, (value) => !isEmpty(value));
