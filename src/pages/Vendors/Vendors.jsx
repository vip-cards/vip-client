import { VendorCard } from "components/Cards";
import PageQueryContainer from "components/PageQueryContainer/PageQueryContainer";
import { useState } from "react";
import { useParams } from "react-router";
import Select from "react-select";
import useSWR from "swr";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import clientServices from "../../services/clientServices";

import {
  faArrowDownWideShort,
  faLocation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { t } from "i18next";
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
  const [filter, setFilter] = useState(initialFilters);
  const [sort, setSort] = useState(null);
  console.log(sort);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
    ...filter,
  });

  const fetcherSwitch = (key, params) => {
    switch (key) {
      case "rating":
        return clientServices.listAllVendors(params);
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

  console.log(data);
  const vendorListRender = () => {
    if (vendorsLoading) return <LoadingSpinner />;

    if (!data.records?.length) return <NoData />;

    return data.records.map((vendor) => {
      return <VendorCard key={vendor._id} vendor={vendor} />;
    });
  };

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
        <div className="z-10 p-5">
          <Select
            defaultValue={sort?.value}
            className="w-60"
            isClearable
            name="sort"
            getOptionValue={(option) => option.value}
            options={sortOptions}
            onChange={(val) => setSort(val)}
          />
        </div>
      </header>
    </PageQueryContainer>
  );
}
