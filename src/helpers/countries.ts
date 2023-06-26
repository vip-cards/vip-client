import { getCities, getCountries } from "country-city-multilanguage";
import i18n from "../locales/i18n";
import { useState, useEffect } from "react";
import _countriesArr from "helpers/countries-arr.json";

export const useAddressList = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryId, setCountryId] = useState();
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

interface ICity {
  en: string;
  ar: string;
  index: number;
}

interface ICountry {
  en: string;
  ar: string;
  index: number;
  code: string;
  cities: ICity[];
  alpha3: string;
}

interface IMappedCountry {
  name: {
    en: string;
    ar: string;
  };
  _id: number;
  cities: {
    _id: number;
    name: {
      en: string;
      ar: string;
    };
    en: string;
    ar: string;
    index: number;
  }[];
  en: string;
  ar: string;
  index: number;
  code: string;
  alpha3: string;
}

export const countriesArr: IMappedCountry[] = _countriesArr.map(
  (cntry: ICountry) => ({
    ...cntry,
    name: { en: cntry.en, ar: cntry.ar },
    _id: cntry.index,
    
    cities: cntry.cities.map((city: ICity) => ({
      ...city,
      _id: city.index,
      name: { en: city.en, ar: city.ar },
    })),
  })
);
