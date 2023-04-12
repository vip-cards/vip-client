import { VendorCard } from "components/Cards";
import PageQueryContainer from "components/PageQueryContainer/PageQueryContainer";
import { useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import clientServices from "../../services/clientServices";
import "./Vendors.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRankingStar, faStreetView } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

const LIMIT = 9;

export default function Vendors() {
  const { categoryId } = useParams();
  const initialFilters = { category: [categoryId] };
  const [filter, setFilter] = useState(initialFilters);
  const [sort, setSort] = useState(false);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
    ...filter,
  });
  const { data: vendorsData, isLoading: vendorsLoading } = useSWR(
    [sort ? "sorted-vendors" : "all-vendors", queryParams, sort],
    ([key, params, sort]) =>
      sort
        ? clientServices.listAllVendorsByRating(params)
        : clientServices.listAllVendors(params)
  );
  const { records: vendors = undefined, counts: vendorsCount } =
    vendorsData ?? {};

  const vendorListRender = () => {
    if (vendorsLoading) return <LoadingSpinner />;

    if (!vendors?.length) return <NoData />;

    return vendors.map((vendor) => {
      return <VendorCard key={vendor._id} vendor={vendor} />;
    });
  };

  return (
    <PageQueryContainer
      withSideFilter={!categoryId}
      filter={filter}
      itemsCount={vendorsCount}
      listRenderFn={vendorListRender}
      queryParams={queryParams}
      setFilter={setFilter}
      initialFilters={initialFilters}
      setQueryParams={setQueryParams}
    >
      <header className="flex flex-row justify-end w-full gap-4">
        <button
          onClick={() => setSort((prev) => !prev)}
          className={classNames("shadow px-2 py-1 rounded-md", {
            "bg-primary": sort,
            "bg-primary/50": !sort,
          })}
        >
          sort by rating <FontAwesomeIcon icon={faRankingStar} />
        </button>
      </header>
    </PageQueryContainer>
  );
}
