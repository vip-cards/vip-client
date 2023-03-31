import React, { useEffect, useState } from "react";
import BannerCard from "../../components/BannerCard/BannerCard";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ProductCard from "../../components/ProductCard/ProductCard";
import VendorCard from "../../components/VendorCard/VendorCard";
import clientServices from "../../services/clientServices";
import SectionView from "../../views/Home/SectionView/SectionView";
import { A11y, Mousewheel, Keyboard, Autoplay } from "swiper";
import classNames from "classnames";
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
            large: data?.records.filter((item) =>
              item.size.includes("large")
            ),
            small: data?.records.filter((item) =>
              item.size.includes("small")
            ),
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

  useEffect(() => {
    getHomeDataHandler();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={classes["client-home"]}>
      <section
        className={classNames(classes["home-section"], classes["top-ad"])}
      >
        <div className={classes["large-ad"]}>test</div>
        <div className={classes["small-ads-container"]}>
          <Swiper
            style={{
              height: "450px",
            }}
            direction="vertical"
            loop
            autoplay={true}
            spaceBetween={20}
            slidesPerView={3}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            mousewheel={false}
            modules={[A11y, Mousewheel, Keyboard, Autoplay]}
            keyboard={{ enabled: true }}
            freeMode={true}
            centeredSlides
            centeredSlidesBounds
            rewind
          >
            {ads.small?.map((item, idx) => {
              return (
                <SwiperSlide className={classes["small-ad"]}>
                  {({ isActive, isDuplicate, isNext, isPrev, isVisible }) => (
                    <BannerCard banner={item} />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>
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
