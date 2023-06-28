import { ProductCard } from "components/Cards";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import { useNavigate } from "react-router";
import clientServices from "services/clientServices";
import { SwiperSlide } from "swiper/react";
import useSWR from "swr";
import SectionContainer from "../SectionContainer";
import { useTranslation } from "react-i18next";
import HomeSwiper from "../HomeSwiper";

const ProdcutsSections = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: productsData, isLoading: productsLoading } = useSWR(
    "all-products",
    () => clientServices.listAllProducts() // to prevent sending the string in the params
  );

  const { records: products = undefined } = productsData ?? {};

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

  return (
    <>
      {/* Offers */}
      <SectionContainer direction="col">
        <div className="flex w-full flex-row justify-between px-3">
          <h4 className="text-primary"> {t("offers")}</h4>
          <button
            className="shadow text-primary px-3 font-semibold rounded-lg"
            onClick={() => navigate("/offers")}
          >
            {t("showAllOffers")}
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
            {renderProducts("")}
          </HomeSwiper>
        </div>
      </SectionContainer>

      {/* Hot Deals */}
      <SectionContainer direction="col">
        <div className="flex w-full flex-row justify-between px-3">
          <h4 className="text-primary"> {t("hotDeals")}</h4>
          <button
            className="shadow text-primary px-3 font-semibold rounded-lg"
            onClick={() => navigate("/hot-deals")}
          >
            {t("showAllHotDeals")}
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
            {renderProducts("hotDeal")}
          </HomeSwiper>
        </div>
      </SectionContainer>
    </>
  );
};

export default ProdcutsSections;
