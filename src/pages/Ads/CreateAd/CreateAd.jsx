import { MainButton } from "components/Buttons";
import CardContainer from "components/CardContainer/CardContainer";
import { ImageEdit, MainInput } from "components/Inputs";
import { adFormData } from "helpers/forms/ad";
import toastPopup from "helpers/toastPopup";
import useCountriesArr from "helpers/useCountriesArr";
import i18n from "locales/i18n";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import clientServices from "services/clientServices";

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
  const { cities, countries, setCities } = useCountriesArr();
  const user = useSelector((state) => state.auth.userData);
  const vendor = useSelector((state) => state.auth.vendorId);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [uploadImage, setUploadImage] = useState(null);
  const [ad, setAd] = useState({ vendor });

  const lang = i18n.language;
  const withSize = ad.type === "banner";
  //  || ad.type === "pop-up" || ad.type === "notification";
  const withProduct = ad.type === "promotion";
  const withNotification = ad.type === "notification";

  const formDataList = [
    ...adFormData,
    {
      name: "country",
      type: "multi-select",
      list: countries,
      required: true,
      isMulti: false,
      identifier: "name",
      closeMenuOnSelect: true,
    },
    {
      name: "city",
      type: "multi-select",
      list: cities,
      required: true,
      isMulti: false,
      identifier: "name",
      closeMenuOnSelect: true,
    },
    {
      name: "product",
      type: "list",
      list: productList,
      identifier: "name",
      required: true,
    },
  ];

  const submitCreateAdHandler = async (e) => {
    e.preventDefault();

    if (!uploadImage) {
      toastPopup.error("Please provide a valid image!");
      return;
    }
    setLoading(true);
    const formData = new FormData();

    formData.append("image", uploadImage);

    const { age_from, age_to, ...restAd } = ad;
    const mappedData = {
      ...restAd,
      startDate: ad.startDate ?? new Date(),
      endDate: ad.endDate ?? new Date(),
      country: ad.country,
      city: ad.city,
      client: user._id,
      age: {
        from: ad.age_from ?? 15,
        to: ad.age_to ?? 70,
      },

      ...(ad.notification && {
        notification: {
          en: ad.notification,
        },
      }),
    };
    try {
      const adData = await clientServices.createAd(mappedData);
      const adId = adData.record._id;

      const data = await clientServices.uploadAdImg(adId, formData);

      toastPopup.success("Ad Created Successfully");
      navigate("/ads");
    } catch (e) {
      toastPopup.error(e?.response?.data?.error ?? "something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAd((prev) => ({ ...prev, city: null }));
    setCities(ad.country);
  }, [ad.country, setCities]);

  return (
    <CardContainer className="create-ad-page" title={"create_ad"}>
      <form className="create-ad-form" onSubmit={submitCreateAdHandler}>
        {formDataList.map((formInput) => {
          if (formInput.name === "bannerSize" && !withSize) return null;
          if (formInput.name === "product" && !withProduct) return null;
          if (formInput.name === "notification" && !withNotification)
            return null;

          return (
            <MainInput
              {...formInput}
              key={formInput.name}
              state={ad}
              setState={setAd}
            />
          );
        })}

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

        <div className="main-input-label">
          <MainButton
            className="w-full"
            text={t("confirm")}
            loading={loading}
            type="submit"
          />
        </div>
      </form>
    </CardContainer>
  );
}

export default CreateAd;
