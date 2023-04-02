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

import classes from "./Home.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/scss"; // core Swiper
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function Home() {
  const [loading, setLoading] = useState(false);
  // refactor to useReducer
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
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
        // clientServices.listAllAds().then(({ data }) => {}),
        clientServices.listAllVendorCategories().then(({ data }) => {
          setCategories(data?.records);
          return data;
        }),
        clientServices.listAllVendors().then(({ data }) => {
          setVendors(data?.records);
          return data;
        }),
        clientServices.listAllProductsOfType(false).then(({ data }) => {
          setOffers(data?.records);
          return data;
        }),
        clientServices.listAllProductsOfType(true).then(({ data }) => {
          setHotDeals(data?.records);
          return data;
        }),
      ]).then(() => {
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  console.log(dummyData);

  useEffect(() => {
    getHomeDataHandler();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className={classNames(
        classes["client-home"],
        "max-w-[1150px] min-w-[300px] w-[80vw] mx-auto"
      )}
    >
      <header className="flex flex-col gap-8  mb-8">
        <section className="w-full flex flex-row gap-3 h-96">
          <div className="flex-grow min-w-[200px] rounded-xl  flex justify-center items-center overflow-hidden max-w-[70%]">
            <Swiper
              direction="horizontal"
              style={{ height: "100%" }}
              loop
              autoplay={true}
              spaceBetween={20}
              slidesPerView={1}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
              mousewheel={false}
              modules={[
                A11y,
                Mousewheel,
                Keyboard,
                Autoplay,
                Navigation,
                Pagination,
              ]}
              keyboard={{ enabled: true }}
              freeMode={true}
              centeredSlides
              centeredSlidesBounds
              rewind
              navigation
              pagination={{
                clickable: true,
                el: ".swiper-pagination",
                renderBullet: function (index, className) {
                  return `<span class="${className} bg-green-700" style=""></span>`;
                },
              }}
            >
              {dummyData
                .filter((ad) => ad.bannerSize === "large")
                .map((ad) => {
                  return (
                    <SwiperSlide
                      key={ad._id}
                      className="w-full h-full rounded-xl shadow"
                    >
                      <a
                        href={ad.link}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        <img
                          className="w-full h-full object-cover"
                          src={ad.image.url}
                          alt={ad.name}
                        />
                      </a>
                    </SwiperSlide>
                  );
                })}
              <div
                className="swiper-pagination"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <span className="swiper-pagination-bullet">start</span>
                <span className="swiper-pagination-bullet">end</span>
              </div>
            </Swiper>
          </div>
          <div className="w-64 flex flex-grow justify-center items-center rounded-xl shadow overflow-hidden max-w-[30%]">
            <Swiper
              direction="vertical"
              loop
              style={{
                height: "100%",
                minWidth: "10rem",
              }}
              autoplay={false}
              spaceBetween={20}
              slidesPerView={2.1}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
              mousewheel={false}
              modules={[A11y, Mousewheel, Keyboard, Navigation, Autoplay]}
              keyboard={{ enabled: true }}
              freeMode={true}
              centeredSlides
              navigation
              centeredSlidesBounds
              rewind
            >
              {dummyData
                .filter((ad) => ad.bannerSize === "medium")
                .map((ad) => {
                  return (
                    <SwiperSlide
                      key={ad._id}
                      className="w-full h-full rounded-xl shadow"
                    >
                      {({
                        isActive,
                        isDuplicate,
                        isNext,
                        isPrev,
                        isVisible,
                      }) => <BannerCard banner={ad} />}
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </section>
        <section className="w-full flex flex-row gap-3 ">
          <div className="flex-grow min-w-[200px] rounded-xl flex justify-center items-center max-w-full shadow-primary/20 shadow-lg">
            <Swiper
              direction="horizontal"
              loop
              autoplay={false}
              spaceBetween={20}
              slidesPerView={3.7}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
              mousewheel={false}
              modules={[A11y, Mousewheel, Keyboard, Navigation, Autoplay]}
              keyboard={{ enabled: true }}
              freeMode={true}
              centeredSlides
              centeredSlidesBounds
              navigation
              rewind
              className="p-4 h-full"
            >
              {dummyData
                .filter((ad) => ad.bannerSize === "small")
                .map((ad) => {
                  return (
                    <SwiperSlide key={ad._id} className="rounded-xl shadow">
                      {({
                        isActive,
                        isDuplicate,
                        isNext,
                        isPrev,
                        isVisible,
                      }) => <BannerCard banner={ad} />}
                    </SwiperSlide>
                  );
                })}
            </Swiper>
          </div>
        </section>
      </header>

      <section className={classes["home-section"]}>
        <SectionView
          items={banners}
          render={(props) => {
            return <BannerCard banner={props} />;
          }}
          autoplay={true}
        />
      </section>
      <section className={classes["home-section"]}>
        <SectionView
          items={categories}
          link={"/categories"}
          linkTitle={"showAllCategories"}
          render={(props) => {
            return <CategoryCard category={props} />;
          }}
        />
      </section>
      <section className={classes["home-section"]}>
        <SectionView
          items={vendors}
          link={"/vendors"}
          linkTitle={"showAllVendors"}
          render={(props) => {
            return <VendorCard vendor={props} />;
          }}
        />
      </section>
      <section className={classes["home-section"]}>
        <SectionView
          items={offers}
          link={"/offers"}
          linkTitle={"showAllOffers"}
          render={(props) => {
            return <ProductCard product={props} />;
          }}
        />
      </section>
      <section className={classes["home-section"]}>
        <SectionView
          items={hotDeals}
          link={"/hot-deals"}
          linkTitle={"showAllHotDeals"}
          render={(props) => {
            return <ProductCard product={props} />;
          }}
        />
      </section>
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
