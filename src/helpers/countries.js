import { getCities, getCountries } from "country-city-multilanguage";
import i18n from "../locales/i18n";
import { useState, useEffect } from "react";

export const useAddressList = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryId, setCountryId] = useState();
  console.log("USEADDDDRESSSS RUN");
  const lang = i18n.language;

  useEffect(() => {
    const countryList = getCountries(lang);
    const cityList = countryId >= 0 ? getCities(countryId, lang) : [];

    setCountries(
      countryList.map((country) => ({
        name: { [lang]: country.label },
        index: country.index,
      }))
    );
    setCities(
      cityList.map((city) => ({
        name: { [lang]: city.label },
        index: city.index,
      }))
    );
  }, [countryId, lang]);

  return [countries, cities, setCountryId];
};
