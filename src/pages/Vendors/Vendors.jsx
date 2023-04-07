import { VendorCard } from "components/Cards";
import PageQueryContainer from "components/PageQueryContainer/PageQueryContainer";
import { useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import clientServices from "../../services/clientServices";
import "./Vendors.scss";

const LIMIT = 9;

export default function Vendors() {
  const { categoryId } = useParams();
  const initialFilters = { category: [categoryId] };
  const [filter, setFilter] = useState(initialFilters);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
    ...filter,
  });
  const { data: vendorsData, isLoading: vendorsLoading } = useSWR(
    ["all-vendors", queryParams],
    ([key, params]) => clientServices.listAllVendors(params)
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
  console.log(filter);
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
    />
  );
}
