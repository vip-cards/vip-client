import {
  faArrowDownWideShort,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { VendorCard } from "components/Cards";
import PageQueryContainer from "components/PageQueryContainer/PageQueryContainer";
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

  const { data, isLoading: vendorsLoading } = useSWR(
    [sort?.value, queryParams, sort],
    ([key, params, sort]) => fetcherSwitch(key, params)
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
    <PageQueryContainer
      withSideFilter={!categoryId && sort?.value !== "nearest"}
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
              menu: (provided, state) => ({
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
    </PageQueryContainer>
  );
}
