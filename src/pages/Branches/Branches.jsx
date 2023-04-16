import { useEffect, useState } from "react";

import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import { useNavigate, useParams } from "react-router";
import clientServices from "services/clientServices";

import { BranchCard } from "components/Cards";
import PageQueryContainer from "components/PageQueryContainer/PageQueryContainer";
import useSWR from "swr";
import "./Branchs.scss";
const LIMIT = 9;

export default function Branches() {
  const params = useParams();
  let vendorId = params.vendorId;
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
    vendor: vendorId,
  });
  const [sort, setSort] = useState("");
  const { data: branchesData, isLoading: branchesLoading } = useSWR(
    [sort ? "sorted-branches" : "all-branches", queryParams, sort],
    ([key, params, sort]) =>
      !!sort
        ? clientServices.listNearestVendorBranches(params)
        : clientServices.listAllVendorBranches(params)
  );
  const { records: branches = undefined, counts: branchesCount } =
    branchesData ?? {};

  const branchListRender = () => {
    if (branchesLoading) return <LoadingSpinner />;

    if (!branches?.length) return <NoData />;

    return branches.map((branchData) => {
      return <BranchCard key={branchData._id} branch={branchData} />;
    });
  };
  const handleSortSelection = (event) => {
    const selection = event.target.value;
    switch (selection) {
      case "nearest":
      case "rating":
        setSort(selection);
        setQueryParams((q) => ({ ...q, long: 40, lat: 43 }));
        break;
      default:
        setSort("");
        break;
    }
  };

  return (
    <PageQueryContainer
      itemsCount={branchesCount}
      listRenderFn={branchListRender}
      queryParams={queryParams}
      withSideFilter={false}
      initialFilters={{
        page: 1,
        limit: LIMIT,
        vendor: vendorId,
      }}
      setQueryParams={setQueryParams}
    >
      <header className="flex flex-row justify-end w-full gap-4">
        <select name="arrange" id="sort-arrange" onChange={handleSortSelection}>
          <option value="" disabled>
            arrange by
          </option>
          <option value="nearest">nearest</option>
          <option value="rating">rating</option>
        </select>
      </header>
      {/* <div className="flex flex-row gap-5 flex-wrap">{branchListRender()}</div> */}
    </PageQueryContainer>
  );
}
