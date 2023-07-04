import classNames from "classnames";
import { MainImage } from "components";
import { MainButton } from "components/Buttons";
import CardContainer from "components/CardContainer/CardContainer";
import { ImageEdit, MainInput } from "components/Inputs";
import Modal from "components/Modal/Modal";
import dayjs from "dayjs";
import { adFormData } from "helpers/forms/ad";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import useCountriesArr from "helpers/useCountriesArr";
import HomeSwiper from "pages/Home/HomeSwiper";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import clientServices from "services/clientServices";
import { selectAuth } from "store/auth-slice";
import { SwiperSlide } from "swiper/react";
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
  //
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cities, countries, setCities } = useCountriesArr();

  const auth = useSelector(selectAuth);
  const user = auth.userData;
  const vendor = auth.vendorId;

  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [uploadImage, setUploadImage] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [ad, setAd] = useState<{ [x: string]: any }>({ vendor });
  const [notificationModal, setNotificationModal] = useState(false);

  const withSize = ad.type === "banner";
  const withProduct = ad.type === "promotion";
  const withNotification = ad.type === "notification";

  const imgUrl = !!uploadImage && URL.createObjectURL(uploadImage).toString();

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
      toastPopup.error(responseErrorToast(e));
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
          className=""
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
        <MainButton
          type="button"
          variant="secondary"
          className={classNames({
            "opacity-50 pointer-events-none": !uploadImage,
          })}
          onClick={() => setPreviewModal(!!uploadImage)}
        >
          {t("preview")}
        </MainButton>
        <div className="main-input-label">
          <MainButton
            className="w-full"
            text={t("confirm")}
            loading={loading}
            type="submit"
          />
        </div>
      </form>
      <Modal
        visible={uploadImage && previewModal}
        title=""
        onClose={() => setPreviewModal(false)}
      >
        <div
          className={classNames("overflow-y-scroll h-[70vh]", {
            hidden: !uploadImage || ad.type !== "banner",
          })}
        >
          {/* --- */}
          <section>
            <h4>{t("largeBanner")}</h4>
            <div className="flex-grow h-72 min-w-[200px] rounded-xl overflow-hidden flex justify-center items-center max-w-full">
              <HomeSwiper
                direction="horizontal"
                slidesPerView={1}
                style={{ height: "100%" }}
                spaceBetween={20}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination",
                  renderBullet: function (index, className) {
                    return `<span class="${className} bg-primary" style=""></span>`;
                  },
                }}
              >
                {Array(7)
                  .fill(0)
                  .map((_, i) => (
                    <SwiperSlide
                      key={"largeAd" + i}
                      className="w-full h-full rounded-xl shadow overflow-hidden"
                    >
                      <MainImage src={imgUrl} />
                    </SwiperSlide>
                  ))}
              </HomeSwiper>
            </div>
          </section>
          {/* --- */}
          <section className="border-t border-t-black/10 mt-4">
            <h4>{t("mediumBanner")}</h4>
            <div className="flex-grow h-72 min-w-[200px] rounded-xl overflow-hidden flex justify-center items-center max-w-full">
              <HomeSwiper
                direction="horizontal"
                style={{ height: "100%" }}
                spaceBetween={20}
                breakpoints={{
                  300: { slidesPerView: 1.2 },
                  480: { slidesPerView: 1.5 },
                  540: { slidesPerView: 1.8 },
                  768: { slidesPerView: 2.4 },
                  860: { slidesPerView: 2.8 },
                }}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination",
                  renderBullet: function (index, className) {
                    return `<span class="${className} bg-primary" style=""></span>`;
                  },
                }}
              >
                {Array(7)
                  .fill(0)
                  .map((_, i) => (
                    <SwiperSlide
                      key={"mediumAd" + i}
                      className="w-full h-full rounded-xl shadow overflow-hidden"
                    >
                      <MainImage src={imgUrl} />
                    </SwiperSlide>
                  ))}
              </HomeSwiper>
            </div>
          </section>
          {/* --- */}
          <section className="border-t border-t-black/10 mt-4">
            <h4>{t("smallBanner")}</h4>
            <div className="flex-grow h-40 min-w-[200px] rounded-xl overflow-hidden flex justify-center items-center max-w-full">
              <HomeSwiper
                direction="horizontal"
                style={{ height: "100%" }}
                spaceBetween={20}
                breakpoints={{
                  300: { slidesPerView: 1.2 },
                  480: { slidesPerView: 1.5 },
                  540: { slidesPerView: 1.8 },
                  768: { slidesPerView: 2.5 },
                  860: { slidesPerView: 2.9 },
                  992: { slidesPerView: 3.2 },
                }}
                pagination={{
                  clickable: true,
                  el: ".swiper-pagination",
                  renderBullet: function (index, className) {
                    return `<span class="${className} bg-primary" style=""></span>`;
                  },
                }}
              >
                {Array(7)
                  .fill(0)
                  .map((_, i) => (
                    <SwiperSlide
                      key={"smallAd" + i}
                      className="w-full h-full rounded-xl shadow overflow-hidden"
                    >
                      <MainImage src={imgUrl} />
                    </SwiperSlide>
                  ))}
              </HomeSwiper>
            </div>
          </section>
        </div>

        <div
          className={classNames("overflow-y-scroll h-[70vh]", {
            hidden: !uploadImage || ad.type !== "popup",
          })}
        >
          <MainImage src={imgUrl} />
        </div>

        {/*         */}
        <div
          className={classNames("overflow-y-scroll h-[70vh]", {
            hidden: !uploadImage || ad.type !== "notification",
          })}
        >
          <h4>{t("notification")}</h4>
          <div className="flex-grow min-w-[200px] rounded-xl overflow-hidden flex justify-center items-center max-w-full">
            <ul className="max-h-[75vh] z-50 relative overflow-y-auto transform-gpu max-xs:ltr:!-translate-x-[91.7%] max-xs:rtl:!-translate-x-[8.09%]">
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <li
                    key={"notification" + i}
                    className={classNames(
                      "relative cursor-pointer px-3 py-5 hover:bg-gray-100 w-[21rem] max-w-[90vw]",
                      {
                        "bg-slate-100/40 border-0 border-b-2 border-b-slate-300/40":
                          false,
                      }
                    )}
                    onClick={() => setNotificationModal(true)}
                  >
                    <span className="ml-auto absolute w-2 h-2 bg-primary rounded-full ltr:right-2 rtl:left-2 top-2 animate-pulse"></span>

                    <div className="!flex w-full flex-row justify-center items-start gap-2 h-12">
                      <div className="w-10 h-10 bg-primary rounded-xl overflow-hidden shrink-0">
                        <MainImage src={imgUrl} />
                      </div>
                      <p className="me-auto !whitespace-normal line-clamp-2 text-ellipsis shrink-0 grow-0 w-[10rem]">
                        {ad.notification ?? "No Text"}
                      </p>
                      <time
                        className="text-xs text-gray-600/50 lowercase mt-auto flex-grow-0 flex-shrink-0"
                        dateTime={dayjs().toISOString()}
                      >
                        {dayjs().isBefore(dayjs().subtract(3, "day"))
                          ? dayjs().format("DD-MM-YYYY")
                          : dayjs().fromNow()}
                      </time>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Modal>
      <Modal
        onClose={() => setNotificationModal(false)}
        visible={notificationModal}
        title=""
      >
        <a
          href={ad.link ?? "/"}
          target="_blank"
          rel="noreferrer"
          className="w-full h-full block"
        >
          <MainImage src={imgUrl} />
        </a>
      </Modal>
    </CardContainer>
  );
}

export default CreateAd;
