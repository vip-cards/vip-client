import { MainButton } from "components/Buttons";
import CardContainer from "components/CardContainer/CardContainer";
import { ImageEdit, MainInput } from "components/Inputs";
import { useAddressList } from "helpers/countries";
import toastPopup from "helpers/toastPopup";
import i18n from "locales/i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import clientServices from "services/clientServices";

import { getCities, getCountries } from "country-city-multilanguage";
import "./CreateAd.scss";

/***
 * name
 * type/position
 * daily budget
 * start date
 * end date
 * location
 *
 */
function CreateAd() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [countries, cities, setCountryId] = useAddressList();
  const user = useSelector((state) => state.auth.userData);
  const userRole = useSelector((state) => state.auth.userRole);
  const vendor = useSelector((state) => state.auth.vendorId);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [uploadImage, setUploadImage] = useState(null);
  const [ad, setAd] = useState({ vendor });

  const lang = i18n.language;
  const withSize =
    ad.type === "banner" || ad.type === "pop-up" || ad.type === "notification";
  const withProduct = ad.type === "promotion";

  const formDataList = [
    { name: "name", type: "text", required: false },

    { name: "startDate", type: "date", required: true, dateRange: "start" },
    { name: "endDate", type: "date", required: true, dateRange: "end" },
    {
      name: "country",
      type: "list",
      list: countries,
      identifier: "name",
      required: true,
    },
    {
      name: "city",
      type: "list",
      list: cities,
      identifier: "name",
      required: true,
    },
    {
      name: "type",
      type: "list",
      list: [
        { name: { en: "banner", ar: "banner" } },
        { name: { en: "pop-up", ar: "pop-up" } },
        { name: { en: "promotion", ar: "promotion" } },
        { name: { en: "appear-first", ar: "appear-first" } },
        { name: { en: "notification", ar: "notification" } },
      ],
      identifier: "name",
      required: true,
    },
    {
      name: "product",
      type: "list",
      list: productList,
      identifier: "name",
      required: true,
    },
    {
      name: "bannerSize",
      type: "list",
      list: [
        { name: { en: "small" } },
        { name: { en: "medium" } },
        { name: { en: "large" } },
      ],
      identifier: "name",
      required: true,
    },
    {
      name: "gender",
      type: "select",
      list: [{ name: "male" }, { name: "female" }, { name: "both" }],
      identifier: "name",
      required: true,
    },
    { name: "age_from", type: "number", required: false },
    { name: "age_to", type: "number", required: false },
  ];

  const submitCreateAdHandler = async (e) => {
    e.preventDefault();
    console.log(vendor);
    console.log(user._id);
    if (!uploadImage && withSize) {
      toastPopup.error("Please provide a valid image!");
      return;
    }
    setLoading(true);
    const formData = new FormData();

    formData.append("image", uploadImage);

    const countryIdx = getCountries(lang)?.find(
      (country) =>
        country.label === ad.country || country.label_ar === ad.country
    )?.index;
    const cityIdx = getCities(countryIdx, lang).find(
      (cty) => cty.label === ad.city || cty.label_ar === ad.city
    )?.value;

    const country = {
      index: countryIdx,
      en: getCountries("en")?.find((ctry) => ctry.index === countryIdx).label,
      ar: getCountries("ar")?.find((ctry) => ctry.index === countryIdx).label,
    };

    const city = {
      index: cityIdx,
      en: getCities(countryIdx, "en").find((cty) => cty.value === cityIdx)
        .label,
      ar: getCities(countryIdx, "ar").find((cty) => cty.value === cityIdx)
        .label,
    };

    const mappedData = {
      ...ad,
      startDate: ad.startDate ?? new Date(),
      endDate: ad.endDate ?? new Date(),
      country: country,
      city: city,
      client: user._id,
      age: {
        from: ad.age_from ?? 15,
        to: ad.age_to ?? 70,
      },
    };
    try {
      const adData = await clientServices.createAd(mappedData);
      const adId = adData.record._id;
      if ("image" in formData) {
        const data = await clientServices.uploadAdImg(adId, formData);
      }
      toastPopup.success("Ad Created Successfully");
      navigate("/ads");
    } catch (e) {
      toastPopup.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ad.country) return;

    const idx = countries.findIndex(({ name }) => name[lang] === ad.country);
    if (idx >= 0) setCountryId(countries[idx].index);
  }, [ad.country, countries, lang, setCountryId]);

  return (
    <CardContainer className="create-ad-page" title={"create new ad"}>
      <form className="create-ad-form" onSubmit={submitCreateAdHandler}>
        {formDataList.map((formInput) => {
          if (formInput.name === "bannerSize" && !withSize) return null;
          if (formInput.name === "product" && !withProduct) return null;

          return (
            <MainInput
              key={formInput.name}
              name={formInput.name}
              type={formInput.type}
              required={formInput.required}
              list={formInput.list}
              identifier={formInput.identifier}
              state={ad}
              setState={setAd}
              dateRange={formInput.dateRange}
            />
          );
        })}
        {withSize && ad.bannerSize && (
          <ImageEdit
            setImgUpdated={setUploadImage}
            setUploadImage={setUploadImage}
            uploadImage={uploadImage}
            style={{
              overflow: "hidden",
              width: "100%",
              height:
                ad.bannerSize === "small"
                  ? "100px"
                  : ad.bannerSize === "medium"
                  ? "200px"
                  : "300px",
            }}
          />
        )}

        <div className="main-input-label">
          <MainButton
            className="w-full"
            text={t("confirmAd")}
            loading={loading}
            type="submit"
          />
        </div>
      </form>
    </CardContainer>
  );
}

export default CreateAd;
