import JobCard from "components/Cards/JobCard/JobCard";
import Pagination from "components/Pagination/Pagination";
import { listRenderFn } from "helpers/renderFn";
import { useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";

const LIMIT = 5;
export default function HiringTabViewCreatedJobs() {
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
    client: localStorage.getItem("userId"),
  });

  const { data: jobsData, isLoading } = useSWR(
    ["my-created-posts", queryParams],
    ([, queryParams]) => clientServices.listAllPosts(queryParams)
  );

  const { records: jobs = undefined, counts = 0 } = jobsData ?? {};
  const totalPages = Math.ceil(counts / LIMIT);
  return (
    <div className="flex flex-col h-full flex-grow">
      <div className="jobs-cards-container ">
        {listRenderFn({
          isLoading,
          list: jobs,
          render: (job) => {
            return <JobCard key={job._id} job={job} />;
          },
        })}
      </div>
      <Pagination
        count={totalPages}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
    </div>
  );
}
