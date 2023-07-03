import { useCallback, useEffect, useState } from "react";

const useCountriesArr = () => {
  const [countries, setCountries] = useState<IMappedCountry[]>();
  const [cities, setCities] = useState<IMappedCity[]>([]);

  const chooseCountry = useCallback(
    (country: IMappedCountry | null) => {
      if (!country) return setCities([]);

      const selectedCountry = countries.find(
        (cntry) => cntry._id === country._id
      );

      return setCities(selectedCountry?.cities ?? []);
    },
    [countries]
  );

  useEffect(() => {
    import("helpers/countries-arr.json").then(({countries}) => {
      const list = countries?.map(countryMapping());
      setCountries(list);
    });
  }, []);

  return { countries, cities, setCities: chooseCountry };
};

export default useCountriesArr;

function countryMapping(): (
  value: ICountry,
  index: number,
  array: ICountry[]
) => IMappedCountry {
  return (cntry: ICountry) => ({
    ...cntry,
    name: { en: cntry.en, ar: cntry.ar },
    _id: cntry.index,

    cities: cntry.cities.map((city: ICity) => ({
      ...city,
      _id: city.index,
      name: { en: city.en, ar: city.ar },
    })),
  });
}
