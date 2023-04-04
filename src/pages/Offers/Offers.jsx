import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { IconButton, MainButton } from "components/Buttons";
import ProductCard from "components/Cards/ProductCard/ProductCard";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import MainInput from "components/MainInput/MainInput";
import NoData from "components/NoData/NoData";
import { getLocalizedWord } from "helpers/lang";
import { useEffect, useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";
import { useLocation } from "react-router";
import Search from "components/Inputs/Search/Search";

const LIMIT = 9;

export default function Offers({ isHotDeal = false }) {
  const location = useLocation();
  const [filter, setFilter] = useState({ vendors: [], categories: [] });
  const [queryParams, setQueryParams] = useState({ page: 1, limit: LIMIT });
  const [searchQuery, setSearchQuery] = useState("");

  const { data: productsData, isLoading: productsLoading } = useSWR(
    ["all-products", isHotDeal, queryParams],
    () => clientServices.listAllProducts({ isHotDeal, ...queryParams })
  );

  const { data: categories } = useSWR(
    "all-categories",
    clientServices.listAllCategories
  );
  const { data: vendors } = useSWR(
    "all-vendors",
    clientServices.listAllVendors
  );

  const { records: products = undefined, counts } = productsData ?? {};
  const totalPages = Math.ceil(counts / LIMIT);

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
    if (!products.length) return <NoData />;

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
      const category = filter.categories.length
        ? { category: filter.categories }
        : null;
      const vendor = filter.vendors.length ? { vendor: filter.vendors } : null;
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
    <>
      <Search
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        onClick={handleProductSearch}
      />
      <main className="flex flex-col p-8 gap-4 min-h-[80vh] max-h-screen overflow-hidden">
        <div className="flex flex-row flex-wrap gap-4 justify-start items-start ">
          <button
            onClick={() => setFilter((f) => ({ ...f, categories: [] }))}
            className={classNames("px-3 py-1 rounded-lg border bg-primary")}
          >
            Reset
          </button>
          {categories?.map((category) => (
            <button
              onClick={() => toggleFilter("categories", category._id)}
              key={category._id}
              className={classNames("px-3 py-1 rounded-lg border", {
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
        </div>
        <div className="flex flex-row flex-wrap gap-4 justify-start items-start ">
          <button
            onClick={() => setFilter((f) => ({ ...f, vendors: [] }))}
            className={classNames("px-3 py-1 rounded-lg border bg-primary")}
          >
            Reset
          </button>
          {vendors?.map((vendor) => (
            <button
              onClick={() => toggleFilter("vendors", vendor._id)}
              key={vendor._id}
              className={classNames("px-3 py-1 rounded-lg border", {
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
        </div>
        <div className="flex flex-row w-full h-full gap-8 flex-wrap max-h-[85vh] overflow-y-auto p-5 justify-around flex-grow">
          {productListRender()}
        </div>
        <div className="flex flex-row gap-3 justify-center items-center">
          <MainButton
            disabled={1 === queryParams.page}
            onClick={() =>
              setQueryParams((params) => ({
                ...params,
                page: params.page > 1 ? params.page - 1 : 1,
              }))
            }
            className="p-2 !rounded-full justify-center items-center flex aspect-square disabled:bg-primary/50"
            size="small"
          >
            {"<"}
          </MainButton>
          {[...Array.from({ length: totalPages }, (v, i) => i + 1)]?.map(
            (item) => (
              <MainButton
                disabled={item === queryParams.page}
                onClick={() =>
                  setQueryParams((params) => ({ ...params, page: item }))
                }
                className={classNames(
                  {
                    "!bg-primary/50": item !== queryParams.page,
                  },
                  "p-2 !rounded-full justify-center items-center flex aspect-square"
                )}
                size="small"
              >
                {item}
              </MainButton>
            )
          )}
          <MainButton
            disabled={totalPages === queryParams.page}
            onClick={() =>
              setQueryParams((params) => ({
                ...params,
                page: params.page < totalPages ? params.page + 1 : totalPages,
              }))
            }
            className="p-2 !rounded-full justify-center items-center flex aspect-square disabled:bg-primary/50"
            size="small"
          >
            {">"}
          </MainButton>
        </div>
      </main>
    </>
  );
}

const FilterToggle = ({ name = "filter", onToggle, selected = false, id }) => {
  const handleFilterToggle = () => {
    onToggle(id);
  };

  return (
    <button
      className="group  max-w-full flex flex-row w-full flex-nowrap justify-between items-center my-1 px-2 border-b-[1px] border-slate-400"
      onClick={handleFilterToggle}
    >
      <p className="text-lg whitespace-nowrap max-w-[8rem] text-ellipsis overflow-hidden">
        {name}
      </p>
      <div
        className={classNames(
          "aspect-square w-4 h-4 rounded-full border-2 border-black",
          {
            "bg-primary": selected,
            "bg-transparent group-hover:bg-primary/50": !selected,
          }
        )}
      ></div>
    </button>
  );
};

const FilterGroup = ({ title, filter, onToggle, listApi }) => {
  const { data: list, isLoading: vendorsLoading } = useSWR(
    `all-${title}s`,
    listApi
  );
  const group = filter[title];
  return (
    <div className="py-5 px-1 max-w-full">
      <h6 className="font-semibold capitalize">{title}</h6>
      {list?.map((item) => (
        <FilterToggle
          onToggle={(id) => onToggle(title, id)}
          selected={group.includes(item._id)}
          name={getLocalizedWord(item.name)}
          id={item._id}
        />
      ))}
    </div>
  );
};
