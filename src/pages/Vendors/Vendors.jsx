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
import Select from "react-select";
import useSWR from "swr";
import clientServices from "../../services/clientServices";
import "./Vendors.scss";

const LIMIT = 8;
const sortOptions = [
  {
    value: "rating",
    label: (
      <span className="flex justify-between items-center gap-2">
        {t("sortByRating")} <FontAwesomeIcon icon={faArrowDownWideShort} />
      </span>
    ),
  },
  {
    value: "nearest",
    label: (
      <span className="flex justify-between items-center gap-2">
        {t("sortByNearest")} <FontAwesomeIcon icon={faLocation} />
      </span>
    ),
  },
];

export default function Vendors() {
  const { categoryId } = useParams();

  const initialFilters = { category: [categoryId] };
  const initialQueryParams = {
    page: 1,
    limit: LIMIT,
    ...initialFilters,
  };

  const [filter, setFilter] = useState(initialFilters);
  const [sort, setSort] = useState(null);

  const [queryParams, setQueryParams] = useState(initialQueryParams);

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
  const { data: categories } = useSWR("all-vendor-categories", () =>
    clientServices.listAllCategories({ type: "vendor" }).then((res) =>
      res.records.map((category) => ({
        ...category,
        name: getLocalizedWord(category.name),
      }))
    )
  );

  const { data, isLoading: vendorsLoading } = useSWR(
    [sort?.value, queryParams, sort],
    ([key, params, sort]) => fetcherSwitch(key, params)
  );

  const toggleCategory = (id) => {
    const idx = filter.category?.findIndex((item) => item === id);
    if (idx > -1) {
      setFilter((f) => ({
        ...f,
        category: f.category.filter((item) => item !== id),
      }));
    } else {
      setFilter((f) => ({
        ...f,
        category: [...f.category, id],
      }));
    }
  };
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
      <header className="flex flex-row justify-end w-full gap-4">
        <div className="p-5">
          <Select
            defaultValue={sort?.value}
            className="w-60"
            styles={{
              control: (provided, state) => ({
                ...provided,
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                boxShadow: state.isFocused ? "0 0 0 1px #fc7300" : null,
                "&:hover": {
                  border: "1px solid #fc7300",
                },
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 100,
              }),
            }}
            isClearable
            name="sort"
            placeholder={t("choose")}
            getOptionValue={(option) => option.value}
            options={sortOptions}
            onChange={(val) => setSort(val)}
          />
        </div>
      </header>
      <aside className="flex flex-row flex-wrap gap-x-3 gap-y-2 justify-start items-start mb-2">
        <button
          onClick={() => {
            setFilter((f) => ({
              ...f,
              category: categoryId ? [categoryId] : [],
            }));
            setQueryParams({ page: 1, limit: LIMIT });
          }}
          className={classNames("px-3 py-1 rounded-lg border text-sm", {
            "bg-primary/50 shadow-lg text-slate-800": !filter.category?.length,
            "bg-primary shadow text-black": filter.category?.length,
          })}
        >
          {t("reset")}
        </button>
        {categories?.map((category) => (
          <button
            onClick={() => {
              toggleCategory(category._id);
              setQueryParams(initialQueryParams);
            }}
            key={category._id}
            className={classNames("px-3 py-1 rounded-lg border text-sm", {
              "bg-primary":
                filter.category?.findIndex((item) => item === category._id) >
                -1,
              "bg-transparent group-hover:bg-primary/50": !(
                filter.category?.findIndex((item) => item === category._id) > -1
              ),
            })}
          >
            {getLocalizedWord(category.name)}
          </button>
        ))}
      </aside>
    </PageQueryContainer>
  );
}
