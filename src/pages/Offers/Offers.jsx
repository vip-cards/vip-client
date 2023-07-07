import classNames from "classnames";
import ProductCard from "components/Cards/ProductCard/ProductCard";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import PageQueryContainer from "components/PageQueryContainer/PageQueryContainer";
import STOP_UGLY_CACHEING from "constants/configSWR";
import { getLocalizedWord } from "helpers/lang";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import clientServices from "services/clientServices";
import useSWR from "swr";

const LIMIT = 9;

export default function Offers({ isHotDeal = false }) {
  const location = useLocation();
  const [filter, setFilter] = useState({ vendors: [], categories: [] });
  const [queryParams, setQueryParams] = useState({ page: 1, limit: LIMIT });
  const [searchQuery, setSearchQuery] = useState("");

  const { data: productsData, isLoading: productsLoading } = useSWR(
    ["all-products", isHotDeal, queryParams],
    () => clientServices.listAllProducts({ isHotDeal, ...queryParams }),
    STOP_UGLY_CACHEING
  );

  const { data: categoriesData } = useSWR(
    "all--product-categories",
    () => clientServices.listAllCategories({ type: "product" }),
    STOP_UGLY_CACHEING
  );

  const { data: vendorsData } = useSWR(
    "all-vendors",
    () => clientServices.listAllVendors(),
    STOP_UGLY_CACHEING
  );

  const { records: products = undefined, counts: productsCount } =
    productsData ?? {};
  const { records: categories = undefined } = categoriesData ?? {};
  const { records: vendors = undefined } = vendorsData ?? {};

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

  const productListRender = () => {
    if (productsLoading) return <LoadingSpinner />;
    if (!products?.length) return <NoData />;

    return products.map((offer) => {
      return <ProductCard key={offer._id} product={offer} />;
    });
  };

  const handleProductSearch = () => {
    if (!searchQuery) return;
    const arabicReg = /[\u0621-\u064A]/g;
    const isArabic = arabicReg.test(searchQuery);
    const queryObj = {
      ...(!isArabic && { "name.en": searchQuery }),
      ...(isArabic && { "name.ar": searchQuery }),
    };
    setQueryParams((prev) => ({ ...prev, page: 1, ...queryObj }));
  };

  useEffect(() => {
    if (!searchQuery) {
      setQueryParams({ page: 1, limit: LIMIT });
    }
  }, [searchQuery]);

  useEffect(() => {
    setQueryParams((q) => {
      const category = filter.categories?.length
        ? { category: filter.categories }
        : null;
      const vendor = filter.vendors?.length ? { vendor: filter.vendors } : null;
      if (!category && "category" in q) delete q.category;
      if (!vendor && "vendor" in q) delete q.vendor;
      return {
        ...q,
        ...category,
        ...vendor,
      };
    });
  }, [filter]);

  useEffect(() => {
    setSearchQuery("");
    setQueryParams({ page: 1, limit: LIMIT });
    setFilter({ vendors: [], categories: [] });
  }, [location.pathname]);

  return (
    <PageQueryContainer
      itemsCount={productsCount}
      listRenderFn={productListRender}
      queryParams={queryParams}
      withSideFilter={false}
      initialFilters={{
        page: 1,
        limit: LIMIT,
      }}
      setQueryParams={setQueryParams}
    >
      {/* <Search
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        onClick={handleProductSearch}
      /> */}
      <aside className="flex flex-row flex-wrap gap-x-3 gap-y-2 justify-start items-start mb-2">
        <button
          onClick={() => {
            setFilter((f) => ({ ...f, categories: [] }));
            setQueryParams((prev) => {
              return { ...prev, ...{ page: 1, limit: LIMIT } };
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
        {categories?.map((category) => (
          <button
            onClick={() => {
              toggleFilter("categories", category._id);
              setQueryParams((prev) => {
                return { ...prev, ...{ page: 1, limit: LIMIT } };
              });
            }}
            key={category._id}
            className={classNames("px-3 py-1 rounded-lg border text-sm", {
              "bg-primary":
                filter.categories?.findIndex((item) => item === category._id) >
                -1,
              "bg-transparent group-hover:bg-primary/50": !(
                filter.categories?.findIndex((item) => item === category._id) >
                -1
              ),
            })}
          >
            {getLocalizedWord(category.name)}
          </button>
        ))}
      </aside>
      <aside className="flex flex-row flex-wrap gap-x-3 gap-y-2 justify-start items-start mb-3">
        <button
          onClick={() => {
            setFilter((f) => ({ ...f, vendors: [] }));
            setQueryParams((prev) => {
              return { ...prev, ...{ page: 1, limit: LIMIT } };
            });
          }}
          className={classNames("px-3 py-1 rounded-lg border text-sm", {
            "bg-primary/50 shadow-lg text-slate-800": !filter.vendors?.length,
            "bg-primary shadow text-black": filter.vendors?.length,
          })}
        >
          {t("reset")}
        </button>
        {vendors?.map((vendor) => (
          <button
            onClick={() => {
              toggleFilter("vendors", vendor._id);
              setQueryParams((prev) => {
                return { ...prev, ...{ page: 1, limit: LIMIT } };
              });
            }}
            key={vendor._id}
            className={classNames("px-3 py-1 rounded-lg border text-sm", {
              "bg-primary":
                filter.vendors?.findIndex((item) => item === vendor._id) > -1,
              "bg-transparent group-hover:bg-primary/50": !(
                filter.vendors?.findIndex((item) => item === vendor._id) > -1
              ),
            })}
          >
            {getLocalizedWord(vendor.name)}
          </button>
        ))}
      </aside>
    </PageQueryContainer>
  );
}
