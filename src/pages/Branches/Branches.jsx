import { useEffect, useState } from "react";

import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import { useNavigate, useParams } from "react-router";
import clientServices from "services/clientServices";

import { BranchCard } from "components/Cards";
import PageQueryContainer from "components/PageQueryContainer/PageQueryContainer";
import useSWR from "swr";
import "./Branchs.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons";
import toastPopup from "helpers/toastPopup";
const LIMIT = 9;

export default function Branches() {
  const params = useParams();
  let vendorId = params.vendorId;
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
    if (!sort) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            setSort("nearest");
            setQueryParams((q) => ({
              ...q,
              long: position.coords.longitude,
              lat: position.coords.latitude,
            }));
          },
          function (error) {
            toastPopup.error(error.message);
          }
        );
      } else {
        toastPopup.error("couldn't detect your location");
      }
    } else {
      setSort("");
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
        <button
          className={classNames("px-2 py-1 rounded-lg my-4 font-bold", {
            "bg-primary/50 shadow-lg text-slate-800": !sort,
            "bg-primary shadow text-black": sort,
          })}
          onClick={handleSortSelection}
        >
          Sort by nearest <FontAwesomeIcon icon={faArrowDownWideShort} />
        </button>
      </header>
      {/* <div className="flex flex-row gap-5 flex-wrap">{branchListRender()}</div> */}
    </PageQueryContainer>
  );
}
