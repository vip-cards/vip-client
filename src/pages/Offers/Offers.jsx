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
import "./Offers.scss";
import { useLocation } from "react-router";

const LIMIT = 9;

export default function Offers() {
  const { state } = useLocation();
  console.log(state);
  const [filter, setFilter] = useState({ vendor: [], category: [] });
  const [queryParams, setQueryParams] = useState({
    test: "ar",
    page: 1,
    limit: LIMIT,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: productsData,
    error,
    isLoading: productsLoading,
    isValidating,
    mutate,
  } = useSWR(["all-products", queryParams], () =>
    clientServices.listAllProducts(queryParams)
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
    const filteredProducts = products.filter((product) => {
      const isInVendor = filter.vendor.length
        ? filter.vendor?.includes(product.vendor._id)
        : true;
      const isInCategory = filter.category.length
        ? filter.category?.includes(product.category?._id)
        : true;
      return isInVendor && isInCategory;
    });
    return filteredProducts.map((offer) => {
      return <ProductCard key={offer._id} product={offer} />;
    });
  };

  const handleProductSearch = () => {
    const arabicReg = /[\u0621-\u064A]/g;
    const isArabic = arabicReg.test(searchQuery.search);
    const queryObj = {
      ...(!isArabic && { "name.en": searchQuery.search }),
      ...(isArabic && { "name.ar": searchQuery.search }),
    };
    setQueryParams((prev) => ({ ...prev, page: 1, ...queryObj }));
  };

  useEffect(() => {
    if (!searchQuery.search) {
      setQueryParams((prev) => ({ page: 1, limit: LIMIT }));
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col p-8 gap-4 min-h-[80vh] max-h-screen overflow-hidden">
      <div className="flex flex-row gap-4 w-full justify-center items-center mx-4">
        <MainInput
          name="search"
          className="flex-grow"
          setState={setSearchQuery}
          searchQuery={searchQuery}
        />
        <MainButton
          className="h-full aspect-square"
          onClick={handleProductSearch}
        >
          <IconButton icon={faMagnifyingGlass} variant="secondary" />
        </MainButton>
      </div>
      <div className="flex flex-row w-full h-full gap-8 flex-wrap max-h-[85vh] overflow-y-auto p-5 justify-between flex-grow">
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
    </div>
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
