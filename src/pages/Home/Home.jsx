import classNames from "classnames";
import { CategoryCard, VendorCard } from "components/Cards";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import Modal from "components/Modal/Modal";
import NoData from "components/NoData/NoData";
import { t } from "i18next";
import dummyAds from "mock/ad.json";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientServices from "services/clientServices";
import { SwiperSlide } from "swiper/react";
import useSWR from "swr";
import HomeSwiper from "./HomeSwiper";
import SectionContainer from "./SectionContainer";
import classes from "./Home.module.scss";
import loadable from "@loadable/component";

const ProdcutsSections = loadable(() =>
  import("./_components/ProdcutsSections")
);

export default function Home() {
  const navigate = useNavigate();
  const [popUpModalVisible, setPopUpModalVisible] = useState(false);

  const { data: vendorsData, isLoading: vendorsLoading } = useSWR(
    "all-vendors",
    () => clientServices.listAllVendors() // to prevent sending the string in the params
  );
  const { data: categoriesData, isLoading: categoriesLoading } = useSWR(
    "vendor-categories",
    () => clientServices.listAllCategories({ type: "vendor" })
  );
  const { data: advertsData, isLoading: advertsLoading } = useSWR(
    "all-adverts",
    () => clientServices.listAllBanners()
  );

  const { records: categories = undefined } = categoriesData ?? {};
  const { records: vendors = undefined } = vendorsData ?? {};

  const { records: adverts = undefined } = advertsData ?? {};

  const popUps = useMemo(
    () => adverts?.filter((item) => item.isPopUp) ?? [],
    [adverts]
  );

  const randomPopUp = useMemo(
    () => Math.floor(Math.random() * (popUps?.length ?? 0)),
    [popUps]
  );

  async function increaseAdCountHandler(adId) {
    try {
      await clientServices.incrementBannerCount(adId);
    } catch (e) {}
  }
  const renderAds = (size) => {
    if (advertsLoading || !adverts) return <LoadingSpinner />;
    if (!adverts.length)
      return dummyAds
        .filter((ad) => ad.size === size && !ad.isPopUp)
        .map((ad) => {
          return (
            <SwiperSlide
              key={ad._id}
              className="w-full h-full rounded-xl shadow overflow-hidden"
            >
              <a href={ad.link} target="_blank" rel="noreferrer noopener">
                <img
                  className="w-full h-full object-cover"
                  src={ad.image.url}
                  alt={ad.name}
                />
              </a>
            </SwiperSlide>
          );
        });
    return adverts
      .filter((ad) => ad.size === size && !ad.isPopUp)
      .map((ad) => {
        return (
          <SwiperSlide
            key={ad._id}
            className="w-full max-lg:max-h-52 h-full rounded-xl shadow overflow-hidden"
            onClick={(e) => {
              increaseAdCountHandler(ad._id);
            }}
          >
            <a href={ad.link} target="_blank" rel="noreferrer noopener">
              <img
                className="w-full h-full object-cover"
                src={ad.image?.url ?? ad.image?.Location ?? ""}
                alt={ad.name}
              />
            </a>
          </SwiperSlide>
        );
      });
  };

  const renderVendors = () => {
    if (vendorsLoading || !vendors) return <LoadingSpinner />;
    if (!vendors.length) {
      return <NoData />;
    }
    return vendors.map((vendor) => {
      return (
        <SwiperSlide key={vendor._id} className="w-fit h-full">
          <VendorCard vendor={vendor} />
        </SwiperSlide>
      );
    });
  };

  const renderCategories = () => {
    if (categoriesLoading || !categories) return <LoadingSpinner />;
    if (!categories.length) {
      return <NoData />;
    }
    return categories.map((category) => {
      return (
        <SwiperSlide key={category._id} className="w-fit h-full">
          <CategoryCard category={category} />
        </SwiperSlide>
      );
    });
  };

  useEffect(() => {
    if (popUps?.length) {
      setPopUpModalVisible(true);
    }
  }, [popUps]);

  return (
    <div
      className={classNames(
        classes["client-home"],
        "page-wrapper max-sm:!w-full"
      )}
    >
      <header className="flex flex-col gap-8 my-8">
        <SectionContainer direction="col" className="lg:flex-row lg:h-96">
          <div className="flex-grow max-lg:h-72 min-w-[200px] rounded-xl overflow-hidden flex justify-center items-center lg:max-w-[70%] max-w-full">
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
              {renderAds("large")}
            </HomeSwiper>
          </div>
          {/* large screens */}
          <div className="w-fit hidden lg:flex flex-grow justify-center items-center rounded-xl overflow-hidden max-w-[30%]">
            <HomeSwiper
              direction="vertical"
              style={{
                height: "100%",
                minWidth: "10rem",
              }}
              spaceBetween={20}
              slidesPerView={2.1}
            >
              {renderAds("medium")}
            </HomeSwiper>
          </div>
          {/* small screens --> hidden for now */}
          <div className="w-full flex lg:hidden flex-grow justify-center items-center rounded-xl overflow-hidden max-w-full">
            <HomeSwiper
              direction="horizontal"
              breakpoints={{
                300: { slidesPerView: 1.2 },
                480: { slidesPerView: 1.5 },
                540: { slidesPerView: 1.8 },
                768: { slidesPerView: 2.4 },
                860: { slidesPerView: 2.8 },
              }}
              spaceBetween={20}
            >
              {renderAds("medium")}
            </HomeSwiper>
          </div>
        </SectionContainer>

        <SectionContainer direction="row" className="max-sm:hidden">
          <div className="flex-grow  min-w-[200px] rounded-xl flex justify-center items-center max-w-full h-40">
            <HomeSwiper
              direction="horizontal"
              spaceBetween={20}
              breakpoints={{
                300: { slidesPerView: 1.2 },
                480: { slidesPerView: 1.5 },
                540: { slidesPerView: 1.8 },
                768: { slidesPerView: 2.4 },
                860: { slidesPerView: 2.8 },
                992: { slidesPerView: 3.1 },
              }}
            >
              {renderAds("small")}
            </HomeSwiper>
          </div>
        </SectionContainer>
      </header>

      {/* Categories */}
      <SectionContainer direction="col">
        <div className="flex w-full flex-row justify-between px-3">
          <h4 className="text-primary">{t("categories")}</h4>
          <button
            className="shadow text-primary px-3 font-semibold rounded-lg"
            onClick={() => navigate("/categories")}
          >
            {t("showAllCategories")}
          </button>
        </div>
        <div className="flex-grow min-w-[200px] rounded-xl flex justify-center items-center max-w-full">
          <HomeSwiper
            direction="horizontal"
            spaceBetween={20}
            breakpoints={{
              300: { slidesPerView: 1.7 },
              400: { slidesPerView: 1.2 },
              480: { slidesPerView: 1.25 },
              540: { slidesPerView: 1.45 },
              768: { slidesPerView: 2.1 },
              860: { slidesPerView: 2.5 },
              992: { slidesPerView: 3 },
              1024: { slidesPerView: 3.2 },
            }}
          >
            {renderCategories()}
          </HomeSwiper>
        </div>
      </SectionContainer>

      {/* Vendors */}
      <SectionContainer direction="col">
        <div className="flex w-full flex-row justify-between px-3">
          <h4 className="text-primary"> {t("vendors")}</h4>
          <button
            className="shadow text-primary px-3 font-semibold rounded-lg"
            onClick={() => navigate("/vendors")}
          >
            {t("showAllVendors")}
          </button>
        </div>
        <div className="flex-grow min-w-[200px] rounded-xl flex justify-center items-center max-w-full">
          <HomeSwiper
            direction="horizontal"
            spaceBetween={20}
            breakpoints={{
              300: { slidesPerView: 1 },
              480: { slidesPerView: 1.25 },
              540: { slidesPerView: 1.45 },
              768: { slidesPerView: 2.1 },
              860: { slidesPerView: 2.5 },
              992: { slidesPerView: 3 },
              1024: { slidesPerView: 3.2 },
            }}
          >
            {renderVendors()}
          </HomeSwiper>
        </div>
      </SectionContainer>

      <ProdcutsSections />

      {!!popUps.length && (
        <Modal
          visible={popUpModalVisible}
          onClose={() => {
            setPopUpModalVisible(false);
          }}
        >
          <div
            onClick={(e) => {
              increaseAdCountHandler(popUps[randomPopUp]._id);
            }}
          >
            <a href={popUps[randomPopUp].link} target="_blank" rel="noreferrer">
              <img src={popUps[randomPopUp].image.Location} alt="" />
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
}
