import {
  faCommentDots,
  faMoneyCheck,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import CardContainer from "components/CardContainer/CardContainer";
import { BranchCard, ProductCard } from "components/Cards";
import Carousel from "components/Carousel/Carousel";
import { withLoadingSkeleton } from "components/LoadingSkeleton/LoadingSkeleton";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import {
  PageQueryWrapper,
  SearchBar,
  SearchProvider,
} from "components/PageQueryContainer/PageQueryContext";
import RatingStars from "components/RatingStars/RatingStars";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";
import clientServices from "services/clientServices";
import { createRoom } from "services/socket/chat";
import useSWR from "swr";
import ReviewModal from "./ReviewModal";
import "./Vendor.scss";
import STOP_UGLY_CACHEING from "constants/configSWR";

const LIMIT = 9;

const vendorFetcher = ([key, id]) =>
  clientServices.getVendor(id).then(({ data }) => data.record[0] as IVendor);

const reviewFetcher = ([key, id]) =>
  clientServices.getVendorReview(id).then((data) => data.records);

const productsFetcher = ([key, params]) =>
  clientServices.listAllProducts({ ...params });

const vendorBranchesFetcher = (
  [key, id] // this api makes desctructing data
) =>
  clientServices
    .listAllVendorBranches({ vendor: id })
    .then((data) => data.records);

export default function Vendor() {
  const [filter, setFilter] = useState({ vendors: [], categories: [] });

  const params = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const vendorId = params.vendorId;
  const initialQuerParams = { page: 1, limit: LIMIT, vendor: vendorId };

  const [queryParams, setQueryParams] = useState(initialQuerParams);
  const [isReviewModalVisible, setReviewModelVisible] = useState(false);

  const { data: vendor, isLoading: isVendorLoading } = useSWR(
    [`vendor-details-${vendorId}`, vendorId],
    vendorFetcher,
    STOP_UGLY_CACHEING
  );
  const { data: reviews, isLoading: isReviewsLoading } = useSWR(
    [`vendor-rev-${vendorId}`, vendorId],
    reviewFetcher,
    STOP_UGLY_CACHEING
  );

  const { data: branches, isLoading: isVendorbranchesLoading } = useSWR(
    [`vendor-branches-${vendorId}`, vendorId],
    vendorBranchesFetcher,
    { ...STOP_UGLY_CACHEING, suspense: !vendor }
  );

  const { data: productsData, isLoading: productsLoading } = useSWR(
    [`all-vendor-products-${vendorId}`, queryParams],
    productsFetcher,
    { ...STOP_UGLY_CACHEING, suspense: !vendor }
  );
  const { records: products = undefined, counts: productsCount } =
    productsData ?? {};

  const productListRender = () => {
    if (productsLoading) return <LoadingSpinner />;
    if (!products?.length) return <NoData />;
    return products.map((offer) => {
      return <ProductCard key={offer._id} product={offer} />;
    });
  };

  function startChatHandler() {
    createRoom({ vendor: vendorId });
  }

  const toggleFilter = (arrayKey = "vendors", itemId) => {
    const newVendorFilterList = [...filter[arrayKey]];
    const idx = filter[arrayKey].findIndex((value) => value === itemId);
    if (idx > -1) {
      newVendorFilterList.splice(idx, 1);
    } else {
      newVendorFilterList.push(itemId);
    }

    setFilter((filters) => ({ ...filters, [arrayKey]: newVendorFilterList }));
  };

  useEffect(() => {
    setQueryParams((q) => {
      const category = filter.categories?.length
        ? { category: filter.categories }
        : null;

      if (!category && "category" in q) delete q.category;

      return {
        ...q,
        ...category,
      };
    });
  }, [filter]);

  useLayoutEffect(() => {
    setQueryParams({ page: 1, limit: LIMIT, vendor: vendorId });
  }, [pathname, vendorId]);

  return (
    <CardContainer
      withHeader={false}
      title={getLocalizedWord(vendor?.name)}
      className="client-vendor-home"
    >
      <SearchProvider
        itemsCount={productsCount}
        queryParams={queryParams}
        limit={LIMIT}
        initialFilters={{ vendor: vendorId }}
        setQueryParams={setQueryParams}
        listRenderFn={productListRender}
      >
        <header className="rounded-3xl border-b-2 p-4 gap-4 pb-4 flex flex-col justify-between relative border-0">
          {/* --- cover --- */}

          <a
            href={vendor?.link ?? ""}
            target="_blank"
            rel="noreferrer"
            className="block h-48 w-full bg-primary/20 overflow-hidden rounded-lg shadow-lg"
          >
            {withLoadingSkeleton(
              <img
                src={vendor?.cover?.Location}
                alt={getLocalizedWord(vendor?.name) + " cover"}
                className="w-full h-full object-cover"
              />,
              isVendorLoading
            )}
          </a>

          {/* --- image --- */}
          <div className="relative ltr:pl-36 pt-2 ltr:pr-2 rtl:pl-2 rtl:pr-36">
            <div className="w-28 h-28 overflow-hidden rounded-full absolute -top-16 ltr:left-7 rtl:right-7 border-white border-4 shadow">
              {withLoadingSkeleton(
                <img
                  src={vendor?.image?.Location}
                  alt={getLocalizedWord(vendor?.name) + " img"}
                />,
                isVendorLoading
              )}
            </div>

            {/* --- headers --- */}
            {withLoadingSkeleton(
              <div className="flex flex-row gap-3 justify-start items-center mb-3 flex-wrap">
                <h4 className="text-primary font-semibold whitespace-nowrap">
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
                  <span className="text-xs ltr:mr-2 rtl:ml-2 whitespace-nowrap">
                    {vendor?.hasDelivery
                      ? t("delivaryAvailable")
                      : t("delivaryNotAvailable")}
                  </span>
                  <FontAwesomeIcon
                    icon={faTruckFast}
                    size="lg"
                    className={classNames({
                      "text-primary": vendor?.hasDelivery,
                      "text-slate-700": !vendor?.hasDelivery,
                    })}
                  />
                </div>
                <div className="ml-auto">
                  <span className="text-xs ltr:mr-2 rtl:ml-2 whitespace-nowrap">
                    {vendor?.hasOnlinePayment
                      ? t("onlinePaymentAvailable")
                      : t("onlinePaymentNotAvailable")}
                  </span>
                  <FontAwesomeIcon
                    icon={faMoneyCheck}
                    size="lg"
                    className={classNames({
                      "text-primary": vendor?.hasOnlinePayment,
                      "text-slate-700": !vendor?.hasOnlinePayment,
                    })}
                  />
                </div>
              </div>,
              isVendorLoading
            )}
          </div>

          {/* description */}
          <div className="flex flex-row gap-4 items-center ltr:ml-6 rtl:mr-6 ltr:pr-2 rtl:pl-2">
            {withLoadingSkeleton(
              <p className="max-w-full text-ellipsis overflow-hidden whitespace-nowrap">
                {getLocalizedWord(vendor?.description)}
              </p>,
              isVendorLoading
            )}
            {withLoadingSkeleton(
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
              </button>,
              isVendorLoading
            )}
          </div>
          <div className="rounded-lg overflow-hidden focus-within:shadow-2xl shadow-none transition-shadow">
            <SearchBar />
          </div>
        </header>

        {/* BRANCHES */}
        {withLoadingSkeleton(
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
              pagination={true}
              data={branches}
              autoplay={false}
              extraLarge={4.5}
              midLarge={4}
              large={3.5}
              medium={3}
              largeSmall={2.5}
              midSmall={2}
              extraSmall={1}
              render={(props) => {
                return <BranchCard branch={props} />;
              }}
            />
          </div>,
          isVendorbranchesLoading
        )}

        {/* CATEGORIES */}

        <aside className="flex flex-row flex-wrap gap-x-3 gap-y-2 justify-start items-start mb-2">
          <button
            onClick={() => {
              setFilter((f) => ({ ...f, categories: [] }));
              setQueryParams((prev) => {
                return { ...prev, page: 1, limit: LIMIT, vendor: vendorId };
              });
            }}
            className={classNames("px-3 py-1 rounded-lg border text-sm", {
              "bg-primary/50 shadow-lg text-slate-800":
                !filter.categories?.length,
              "bg-primary shadow text-black": filter.categories?.length,
            })}
          >
            {t("reset")}
          </button>
          {vendor?.productCategories?.map((category) => (
            <button
              onClick={() => {
                toggleFilter("categories", category._id);
                setQueryParams((prev) => {
                  return { ...prev, page: 1, limit: LIMIT, vendor: vendorId };
                });
              }}
              key={category._id}
              className={classNames("px-3 py-1 rounded-lg border text-sm", {
                "bg-primary":
                  filter.categories?.findIndex(
                    (item) => item === category._id
                  ) > -1,
                "bg-transparent group-hover:bg-primary/50": !(
                  filter.categories?.findIndex(
                    (item) => item === category._id
                  ) > -1
                ),
              })}
            >
              {getLocalizedWord(category.name)}
            </button>
          ))}
        </aside>

        <PageQueryWrapper />
      </SearchProvider>
      <ReviewModal
        isVisible={isReviewModalVisible}
        onClose={() => setReviewModelVisible(false)}
        reviews={reviews}
      />
    </CardContainer>
  );
}
