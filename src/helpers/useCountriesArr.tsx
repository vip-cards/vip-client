import { useEffect, useState } from "react";

const useCountriesArr = () => {
  const [countries, setCountries] = useState<IMappedCountry[]>();

  useEffect(() => {
    import("helpers/countries-arr.json").then((data) => {
      const list = data.map(countryMapping());
      setCountries(list);
    });
  }, []);
  return { countries };
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
