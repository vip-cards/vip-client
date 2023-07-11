import { faCommentDots, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import CardContainer from "components/CardContainer/CardContainer";
import { ProductCard } from "components/Cards";
import { withLoadingSkeleton } from "components/LoadingSkeleton/LoadingSkeleton";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import {
  PageQueryWrapper,
  SearchBar,
  SearchProvider,
} from "components/PageQueryContainer/PageQueryContext";
import { getLocalizedWord } from "helpers/lang";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router";
import clientServices from "services/clientServices";
import { createRoom } from "services/socket/chat";
import useSWR from "swr";
import "./Branch.scss";
import STOP_UGLY_CACHEING from "constants/configSWR";

const LIMIT = 9;

/***************************************/
const branchFetcher = ([key, id]) =>
  clientServices.getBranchDetails(id).then(({ data }) => data.record[0]);

/*--- --- --- */
const productsFetcher = ([key, params]) =>
  clientServices.listAllProducts({ ...params });

/*--- --- --- */
const vendorFetcher = ([key, id]) =>
  clientServices.getVendor(id).then(({ data }) => data.record[0]);

/***************************************/

export default function Branch() {
  const [filter, setFilter] = useState({ vendors: [], categories: [] });

  const params = useParams();
  const branchId = params.branchId;
  const vendorId = params.vendorId;
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const initialQuerParams = { page: 1, limit: LIMIT, branches: branchId };
  const [queryParams, setQueryParams] = useState(initialQuerParams);

  const { data: vendor, isLoading: isVendorLoading } = useSWR(
    [`vendor-details-${vendorId}`, vendorId],
    vendorFetcher,
    STOP_UGLY_CACHEING
  );

  const { data: branch, isLoading: isBranchLoading } = useSWR(
    [`branch-details-${branchId}`, branchId],
    branchFetcher,
    STOP_UGLY_CACHEING
  );

  const { data: productsData, isLoading: productsLoading } = useSWR(
    [`all-branch-products-${branchId}`, queryParams],
    productsFetcher,
    { ...STOP_UGLY_CACHEING, suspense: !branch }
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
    setQueryParams({ page: 1, limit: LIMIT, branches: branchId });
  }, [pathname, branchId]);

  function startChatHandler() {
    createRoom({ branch: branchId });
  }

  return (
    <CardContainer
      withHeader={false}
      title={getLocalizedWord(branch?.name)}
      className="client-vendor-home"
    >
      <SearchProvider
        itemsCount={productsCount}
        queryParams={queryParams}
        limit={LIMIT}
        initialFilters={{ branches: branchId }}
        setQueryParams={setQueryParams}
        listRenderFn={productListRender}
      >
        <header className="rounded-3xl border-b-2 p-4 gap-4 pb-4 flex flex-col justify-between relative border-0">
          {/* --- cover --- */}
          <a
            href={branch?.link ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="h-48 w-full bg-primary/20 overflow-hidden rounded-lg shadow-lg"
          >
            {withLoadingSkeleton(
              <img
                src={branch?.cover?.Location}
                alt={getLocalizedWord(branch?.name) + " cover"}
                className="w-full h-full object-cover"
              />,
              isBranchLoading
            )}
          </a>

          {/* --- image --- */}
          <div className="relative ltr:pl-36 pt-2 ltr:pr-2 rtl:pl-2 rtl:pr-36">
            <div className="w-28 h-28 overflow-hidden rounded-full absolute -top-16 ltr:left-7 rtl:right-7 border-white border-4 shadow">
              {withLoadingSkeleton(
                <img
                  src={branch?.image?.Location}
                  alt={getLocalizedWord(branch?.name) + " img"}
                />,
                isBranchLoading
              )}
            </div>

            {/* --- headers --- */}
            {withLoadingSkeleton(
              <div className="flex flex-row gap-3 justify-start items-center mb-3 flex-wrap">
                <h4 className="text-primary font-semibold whitespace-nowrap">
                  {getLocalizedWord(branch?.name)}
                </h4>

                <div className="ml-auto">
                  <span className="text-xs ltr:mr-2 rtl:ml-2 whitespace-nowrap">
                    {branch?.hasDelivery
                      ? t("delivaryAvailable")
                      : t("delivaryNotAvailable")}
                  </span>
                  <FontAwesomeIcon
                    icon={faTruckFast}
                    size="lg"
                    className={classNames({
                      "text-primary": branch?.hasDelivery,
                      "text-slate-700": !branch?.hasDelivery,
                    })}
                  />
                </div>
              </div>,
              isBranchLoading
            )}
          </div>

          {/* description */}
          <div className="flex flex-row gap-4 items-center ltr:ml-6 rtl:mr-6 ltr:pr-2 rtl:pl-2">
            {withLoadingSkeleton(
              <p className="max-w-full text-ellipsis overflow-hidden whitespace-nowrap">
                {getLocalizedWord(branch?.address)}
              </p>,
              isBranchLoading
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
              isBranchLoading
            )}
          </div>
          <div className="rounded-lg overflow-hidden focus-within:shadow-2xl shadow-none transition-shadow">
            <SearchBar />
          </div>
        </header>

        {/* CATEGORIES */}

        <aside className="flex flex-row flex-wrap gap-x-3 gap-y-2 justify-start items-start mt-5 mb-2">
          <button
            onClick={() => {
              setFilter((f) => ({ ...f, categories: [] }));

              setQueryParams((prev) => {
                return { ...prev, page: 1, limit: LIMIT, branches: branchId };
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
                  return { ...prev, page: 1, limit: LIMIT, branches: branchId };
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
    </CardContainer>
  );
}
