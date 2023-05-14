import { faCommentDots, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { BranchCard, CategoryCard, ProductCard } from "components/Cards";
import Carousel from "components/Carousel/Carousel";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import Pagination from "components/Pagination/Pagination";
import RatingStars from "components/RatingStars/RatingStars";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import clientServices from "services/clientServices";
import { createRoom } from "services/socket/chat";
import useSWR from "swr";
import ReviewModal from "./ReviewModal";

import "./Vendor.scss";

const LIMIT = 9;

export default function Vendor() {
  const params = useParams();
  const navigate = useNavigate();
  const vendorId = params.vendorId;
  const { t } = useTranslation();

  const initialQuerParams = { page: 1, limit: LIMIT, vendor: vendorId };

  const [vendor, setVendor] = useState({});
  const [offers, setOffers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [queryParams, setQueryParams] = useState(initialQuerParams);

  const [loading, setLoading] = useState(false);
  const [isReviewModalVisible, setReviewModelVisible] = useState(false);

  const { data } = useSWR(`vendor-rev-${vendorId}`, () =>
    clientServices.getVendorReview(vendorId)
  );
  const reviews = data?.records ?? [];
  const { data: productsData, isLoading: productsLoading } = useSWR(
    ["all-products", queryParams],
    () => clientServices.listAllProducts({ ...queryParams })
  );
  const { records: products = undefined, counts: productsCount } =
    productsData ?? {};
  const totalPages = Math.ceil(productsCount / LIMIT);

  const productListRender = () => {
    if (productsLoading) return <LoadingSpinner />;
    if (!products.length) return <NoData />;

    return products.map((offer) => {
      return <ProductCard key={offer._id} product={offer} />;
    });
  };

  async function getVendorDataHandler() {
    setVendor({});
    setBranches([]);
    setOffers([]);
    setLoading(true);
    try {
      const { data: vendor } = await clientServices.getVendor(vendorId);
      setVendor(vendor.record[0]);

      const { data: allCategories } =
        await clientServices.listAllVendorCategories(vendorId);
      setCategories(allCategories?.records);

      const allBranches = await clientServices.listAllVendorBranches({
        vendor: vendorId,
      });

      setBranches(allBranches?.records);
      setLoading(false);

      const { data: allOffers } = await clientServices.listAllVendorProducts(
        vendorId
      );
      setOffers(allOffers?.records);
    } catch (e) {
      setLoading(false);
    }
  }

  function startChatHandler() {
    createRoom({ vendor: vendorId });
  }

  useEffect(() => {
    getVendorDataHandler();
  }, [vendorId]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="client-vendor-home my-8 app-card-shadow page-wrapper pb-8">
      <header className="rounded-3xl border-b-2 p-4 gap-4 pb-4 flex flex-col justify-between relative border-0">
        <div className="h-48 w-full bg-primary/20 overflow-hidden rounded-lg shadow-lg">
          <img
            src={vendor?.cover?.Location}
            alt={getLocalizedWord(vendor?.name) + " cover"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative ltr:pl-36 pt-2 ltr:pr-2 rtl:pl-2 rtl:pr-36">
          <div className="w-28 h-28 overflow-hidden rounded-full absolute -top-16 ltr:left-7 rtl:right-7 border-white border-4 shadow">
            <img
              src={vendor?.image?.Location}
              alt={getLocalizedWord(vendor?.name) + " img"}
            />
          </div>
          <div className="flex flex-row gap-3 justify-start items-center mb-3">
            <h4 className="text-primary font-semibold">
              {getLocalizedWord(vendor?.name)}
            </h4>
            <button
              onClick={() => setReviewModelVisible(true)}
              className="flex flex-row text-primary gap-3 items-center hover:underline"
            >
              <RatingStars rate={vendor?.rate ?? 0} /> (
              {getLocalizedNumber(reviews?.length)} {t("reviews")})
            </button>
            <div className="ml-auto">
              <span className="text-sm ltr:mr-2 rtl:ml-2">
                {vendor?.hasDelivery
                  ? t("delivaryAvailable")
                  : t("delivaryNotAvailable")}
              </span>
              <FontAwesomeIcon
                icon={faTruckFast}
                size="xl"
                className={classNames({
                  "text-primary": vendor?.hasDelivery,
                  "text-slate-700": !vendor?.hasDelivery,
                })}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center ltr:ml-6 rtl:mr-6 ltr:pr-2 rtl:pl-2">
          <p className="max-w-full text-ellipsis overflow-hidden whitespace-nowrap">
            {getLocalizedWord(vendor?.description)}
          </p>
          <button
            className="flex flex-row items-center justify-center gap-3 p-0 m-0 ltr:ml-auto rtl:mr-auto cursor-pointer min-w-fit"
            onClick={startChatHandler}
          >
            <span className="font-semibold text-primary whitespace-nowrap">
              {t("chatWithUs")}
            </span>
            <FontAwesomeIcon
              icon={faCommentDots}
              size="2x"
              className="text-primary"
            />
          </button>
        </div>
      </header>
      {categories && categories.length > 0 ? (
        <div className="carousel-container">
          <div className="add-button-container">
            <button
              className="add-button"
              onClick={() => {
                navigate(`/vendors/${vendorId}/categories`);
              }}
            >
              {t("showAllCategories")}
            </button>
          </div>
          <Carousel
            data={categories}
            autoplay={false}
            extraLarge={1}
            midLarge={1}
            large={1}
            medium={1}
            largeSmall={1}
            midSmall={1}
            extraSmall={1}
            render={(props) => {
              return <CategoryCard category={props} vendorId={vendorId} />;
            }}
          />
        </div>
      ) : null}
      {branches.length > 0 ? (
        <div className="carousel-container">
          <div className="add-button-container">
            <button
              className="add-button"
              onClick={() => {
                navigate(`/vendors/${vendorId}/branches`);
              }}
            >
              {t("showallBranches")}
            </button>
          </div>
          <Carousel
            data={branches}
            autoplay={false}
            extraLarge={2.5}
            midLarge={1.85}
            large={1.6}
            medium={1.45}
            largeSmall={1.3}
            midSmall={1}
            extraSmall={1}
            render={(props) => {
              return <BranchCard branch={props} />;
            }}
          />
        </div>
      ) : null}

      <div className="flex flex-row w-full h-full gap-8 flex-wrap p-8 min-h-[12rem] justify-around flex-grow">
        {productListRender()}
      </div>
      <Pagination
        count={totalPages}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
      <ReviewModal
        isVisible={isReviewModalVisible}
        onClose={() => setReviewModelVisible(false)}
        reviews={reviews}
      />
    </div>
  );
}
