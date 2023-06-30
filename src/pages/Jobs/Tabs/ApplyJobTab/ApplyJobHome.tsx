import JobCard from "components/Cards/JobCard/JobCard";
import {
  PageQueryWrapper,
  SearchBar,
  SearchProvider,
} from "components/PageQueryContainer/PageQueryContext";
import Pagination from "components/Pagination/Pagination";
import { listRenderFn } from "helpers/renderFn";
import { useLayoutEffect, useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";

const LIMIT = 5;
const initialQuery = {
  page: 1,
  limit: LIMIT,
};
export default function ApplyJobHome({ id = undefined }) {
  const [queryParams, setQueryParams] = useState(initialQuery);
  const {
    data: jobsData,
    isLoading,
    mutate,
  } = useSWR([`view-${id}-jobs`, queryParams], ([, queryParams]) =>
    clientServices.listAllJobs(queryParams)
  );

  const { records: jobs = undefined, counts = 0 } = jobsData ?? {};
  const totalPages = Math.ceil(counts / LIMIT);

  useLayoutEffect(() => {
    if (id) setQueryParams((q) => ({ ...q, client: id }));
    else setQueryParams(initialQuery);
  }, [id]);

  return (
    <SearchProvider
      limit={LIMIT}
      itemsCount={counts}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
      listRenderFn={() =>
        listRenderFn({
          isLoading,
          list: jobs,
          render: (job) => {
            return <JobCard key={job._id} job={job} mutate={mutate} />;
          },
        })
      }
    >
      <div className="focus-within:drop-shadow-2xl shadow-none transition-all border-t-primary border-t-2">
        <SearchBar withSelector={true} types={["jobTitle", "companyName"]} />
      </div>
      <div className="flex flex-col h-full flex-grow">
        <div className="jobs-cards-container ">
          <PageQueryWrapper />
        </div>
      </div>
    </SearchProvider>
  );
}
