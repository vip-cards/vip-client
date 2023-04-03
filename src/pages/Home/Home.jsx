import React, { useEffect, useState } from "react";
import BannerCard from "../../components/BannerCard/BannerCard";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ProductCard from "../../components/ProductCard/ProductCard";
import VendorCard from "../../components/VendorCard/VendorCard";
import clientServices from "../../services/clientServices";
import SectionView from "../../views/Home/SectionView/SectionView";
import {
  A11y,
  Mousewheel,
  Keyboard,
  Autoplay,
  Pagination,
  Navigation,
} from "swiper";
import classNames from "classnames";

import dummyData from "mock/ad.json";
import dummyProducts from "mock/products.json";

import classes from "./Home.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/scss"; // core Swiper
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import SectionContainer from "./SectionContainer";
import { getLocalizedWord } from "helpers/lang";
import { Link, useNavigate } from "react-router-dom";
import { t } from "i18next";
import useSWR from "swr";
import NoData from "components/NoData/NoData";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    data: products,
    error,
    isLoading: productsLoading,
    isValidating,
    mutate,
  } = useSWR("all-products", clientServices.listAllProducts);

  const { data: vendors, isLoading: vendorsLoading } = useSWR(
    "all-vendors",
    clientServices.listAllVendors
  );
  const { data: categories, isLoading: categoriesLoading } = useSWR(
    "all-vendors",
    clientServices.listAllVendorCategories
  );

  const [banners, setBanners] = useState([]);
  const [ads, setAds] = useState({});

  async function getHomeDataHandler() {
    setLoading(true);
    try {
      Promise.any([
        clientServices.listAllBanners().then(({ data }) => {
          setBanners(data?.records);
          setAds({
            large: data?.records.filter((item) => item.size.includes("large")),
            small: data?.records.filter((item) => item.size.includes("small")),
          });
        }),
      ]).then(() => {
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    getHomeDataHandler();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderAds = (size) =>
    dummyData
      .filter((ad) => ad.bannerSize === size)
      .map((ad) => {
        return (
          <SwiperSlide key={ad._id} className="w-full h-full rounded-xl shadow">
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

  const renderProducts = (type) => {
    if (productsLoading || !products) return <LoadingSpinner />;
    const productList = products?.filter(
      (product) =>
        (type === "hotDeal" && product.isHotDeal) ||
        (type !== "hotDeal" && !product.isHotDeal)
    );

    if (!productList.length) {
      return <NoData />;
    }
    return products
      .filter(
        (product) =>
          (type === "hotDeal" && product.isHotDeal) ||
          (type !== "hotDeal" && !product.isHotDeal)
      )
      .map((product) => {
        return (
          <SwiperSlide key={product._id} className="w-fit h-full">
            <ProductCard product={product} />
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

  return (
    <div
      className={classNames(
        classes["client-home"],
        "max-w-[1150px] min-w-[300px] w-[80vw] mx-auto"
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
          {/* small screens */}
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
        <SectionContainer direction="row">
          <div className="flex-grow min-w-[200px] rounded-xl flex justify-center items-center max-w-full h-40">
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

      <SectionContainer direction="col">
        <SectionView
          items={banners}
          render={(props) => {
            return <BannerCard banner={props} />;
          }}
          autoplay={true}
        />
      </SectionContainer>

      {/* Vendors */}
      <SectionContainer direction="col">
        <div className="flex w-full flex-row justify-between px-3">
          <h4 className="text-primary">Categories</h4>
          <button
            className="shadow text-primary px-3 font-semibold rounded-lg"
            onClick={() => navigate("/categories")}
          >
            {t("categories")}
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
              1024: { slidesPerView: 3.35 },
            }}
          >
            {renderCategories()}
          </HomeSwiper>
        </div>
      </SectionContainer>

      {/* Vendors */}
      <SectionContainer direction="col">
        <div className="flex w-full flex-row justify-between px-3">
          <h4 className="text-primary">Vendors</h4>
          <button
            className="shadow text-primary px-3 font-semibold rounded-lg"
            onClick={() => navigate("/vendors")}
          >
            {t("vendors")}
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
              1024: { slidesPerView: 3.35 },
            }}
          >
            {renderVendors()}
          </HomeSwiper>
        </div>
      </SectionContainer>

      {/* Offers */}
      <SectionContainer direction="col">
        <div className="flex w-full flex-row justify-between px-3">
          <h4 className="text-primary">Offers</h4>
          <button
            className="shadow text-primary px-3 font-semibold rounded-lg"
            onClick={() => navigate("/offers")}
          >
            {t("offers")}
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
              1024: { slidesPerView: 3.35 },
            }}
          >
            {renderProducts("")}
          </HomeSwiper>
        </div>
      </SectionContainer>

      {/* Hot Deals */}
      <SectionContainer direction="col">
        <div className="flex w-full flex-row justify-between px-3">
          <h4 className="text-primary">Hot Deals</h4>
          <button
            className="shadow text-primary px-3 font-semibold rounded-lg"
            onClick={() => navigate("/hot-deals")}
          >
            {t("hotDeals")}
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
              1024: { slidesPerView: 3.35 },
            }}
          >
            {renderProducts("hotDeal")}
          </HomeSwiper>
        </div>
      </SectionContainer>
    </div>
  );
}

/** OLD FUNCTIONS **
  // let { data: allCategories } = await clientServices.listAllVendorCategories();
  // let { data: allVendors }    = await clientServices.listAllVendors();
  // let { data: allOffers }     = await clientServices.listAllProductsOfType(false);
  // let { data: allHotDeals }   = await clientServices.listAllProductsOfType(true);
  // let { data: allBanners }    = await clientServices.listAllBanners();

  // setCategories(allCategories?.records);
  // setVendors(allVendors?.records);
  // setOffers(allOffers?.records);
  // setHotDeals(allHotDeals?.records);
  // setBanners(allBanners?.records);
 */

const HomeSwiper = ({ children, ...props }) => (
  <Swiper
    loop
    autoplay={false}
    onSlideChange={() => console.log("slide change")}
    onSwiper={(swiper) => console.log(swiper)}
    mousewheel={false}
    modules={[A11y, Mousewheel, Keyboard, Navigation, Autoplay, Pagination]}
    keyboard={{ enabled: true }}
    freeMode={true}
    centeredSlides
    navigation
    centeredSlidesBounds
    rewind
    className="p-4 h-full w-full"
    {...props}
  >
    {children}
    <div
      className="swiper-pagination"
      style={{
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    ></div>
  </Swiper>
);
