import {
  faArrowDownWideShort,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { VendorCard } from "components/Cards";
import PageQueryContainer from "components/PageQueryContainer/PageQueryContainer";
import { getLocalizedWord } from "helpers/lang";
import { listRenderFn } from "helpers/renderFn";
import { t } from "i18next";
import { useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import clientServices from "../../services/clientServices";
import "./Vendors.scss";
import STOP_UGLY_CACHEING from "constants/configSWR";

const LIMIT = 8;
const sortOptions = [
  {
    value: "rating",
    label: (
      <span className="flex justify-between items-center gap-2">
        {t("sortByRating") as string}{" "}
        <FontAwesomeIcon icon={faArrowDownWideShort} />
      </span>
    ),
  },
  {
    value: "nearest",
    label: (
      <span className="flex justify-between items-center gap-2">
        {t("sortByNearest") as string} <FontAwesomeIcon icon={faLocation} />
      </span>
    ),
  },
];

export default function Vendors() {
  const { categoryId } = useParams();

  const initialFilters = { category: categoryId };
  const initialQueryParams = {
    page: 1,
    limit: LIMIT,
    ...initialFilters,
  };

  const [filter, setFilter] = useState(initialFilters);
  const [sort, setSort] = useState<{ value?: string; label?: any }>(null);

  const [queryParams, setQueryParams] = useState<{
    page: number;
    limit: number;
    [x: string]: any;
  }>(initialQueryParams);

  const fetcherSwitch = (key, params) => {
    switch (key) {
      case "rating":
        return clientServices.listAllVendorsByRating(params);
      case "nearest":
        return clientServices.listNearestVendorBranches(params);
      default:
        return clientServices.listAllVendors(params);
    }
  };
  const { data: categories } = useSWR(
    "all-vendor-categories",
    () =>
      clientServices.listAllCategories({ type: "vendor" }).then((res) =>
        res.records.map((category) => ({
          ...category,
          name: getLocalizedWord(category.name),
        }))
      ),
    STOP_UGLY_CACHEING
  );

  const { data, isLoading: vendorsLoading } = useSWR(
    [sort?.value, queryParams, sort],
    ([key, params, sort]) => fetcherSwitch(key, params),
    STOP_UGLY_CACHEING
  );

  const vendorListRender = () =>
    listRenderFn({
      isLoading: vendorsLoading,
      list: data?.records ?? [],
      render: (vendor) => {
        return <VendorCard key={vendor._id} vendor={vendor} />;
      },
    });

  return (
    // this is the old way of the search provider
    <PageQueryContainer
      withSideFilter={false}
      filter={filter}
      itemsCount={data?.counts ?? 0}
      listRenderFn={vendorListRender}
      queryParams={queryParams}
      setFilter={setFilter}
      initialFilters={initialFilters}
      setQueryParams={setQueryParams}
    >
      <aside className="flex flex-row flex-wrap gap-x-3 gap-y-2 justify-start items-start mb-5">
        <button
          onClick={() => {
            setSort({});
          }}
          className={classNames("px-3 py-1 rounded-lg border text-sm", {
            "bg-primary/50 shadow-lg text-slate-800": sort?.value === undefined,
            "bg-primary shadow text-black": sort?.value !== undefined,
          })}
        >
          <>{t("reset")}</>
        </button>
        {sortOptions.map((option) => (
          <button
            onClick={() => {
              setSort((sort) =>
                sort?.value === option?.value
                  ? {}
                  : {
                      ...sort,
                      value: option.value,
                      label: option.label,
                    }
              );
            }}
            key={option.value}
            className={classNames("px-3 py-1 rounded-lg border text-sm", {
              "bg-primary": sort?.value === option.value,
              "bg-transparent group-hover:bg-primary/50":
                sort?.value !== option.value,
            })}
          >
            {option.label}
          </button>
        ))}
      </aside>

      <aside className="flex flex-row flex-wrap gap-x-3 gap-y-2 justify-start items-start mb-2">
        <button
          onClick={() => {
            setFilter((f) => ({
              ...f,
              category: categoryId ? categoryId : null,
            }));
            setQueryParams({ page: 1, limit: LIMIT });
          }}
          className={classNames("px-3 py-1 rounded-lg border text-sm", {
            "bg-primary/50 shadow-lg text-slate-800": !filter.category,
            "bg-primary shadow text-black": filter.category,
          })}
        >
          <>{t("reset")}</>
        </button>
        {categories?.map((category) => (
          <button
            onClick={() => {
              setFilter((f) => ({
                ...f,
                category:
                  filter.category === category._id ? null : category._id,
              }));
              setQueryParams(initialQueryParams);
            }}
            key={category._id}
            className={classNames("px-3 py-1 rounded-lg border text-sm", {
              "bg-primary": filter.category === category._id,
              "bg-transparent group-hover:bg-primary/50":
                filter.category !== category._id,
            })}
          >
            {getLocalizedWord(category.name)}
          </button>
        ))}
      </aside>
    </PageQueryContainer>
  );
}
