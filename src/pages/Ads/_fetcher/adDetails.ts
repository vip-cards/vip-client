import dayjs from "dayjs";
import clientServices from "services/clientServices";

export const adDetailsFetcher = ([key, _id]: [string, string]): Promise<any> =>
  clientServices.getAd({ _id }).then(({ record }) => {
    const { vendor, timestamp, ...ad } = record[0];

    const mappedData = {
      ...ad,
      startDate: dayjs(ad.startDate).toDate() ?? new Date(),
      endDate: dayjs(ad.endDate).toDate() ?? new Date(),
      country: {
        ...ad.country,
        _id: ad.country.index,
        name: { en: ad.country.en, ar: ad.country.ar },
      },
      city: {
        ...ad.city,
        _id: ad.city.index,
        name: { en: ad.city.en, ar: ad.city.ar },
      },

      age_from: ad.age?.from ?? 15,
      age_to: ad.age?.to ?? 70,

      notification: ad.notification?.en ?? "",
      type: ad.type ?? "banner",
    };

    return mappedData;
  });
