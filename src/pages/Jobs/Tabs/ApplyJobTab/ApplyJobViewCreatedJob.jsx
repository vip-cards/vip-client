import JobCard from "components/Cards/JobCard/JobCard";
import Pagination from "components/Pagination/Pagination";
import STOP_UGLY_CACHEING from "constants/configSWR";
import { listRenderFn } from "helpers/renderFn";
import { useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";

const LIMIT = 5;
export default function ApplyJobViewCreatedJob() {
  const clientId = localStorage.getItem("userId");
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
    client: clientId,
  });

  const {
    data: jobsData,
    isLoading,
    mutate,
  } = useSWR(
    [`${clientId}-my-created-jobs`, queryParams],
    ([, queryParams]) => clientServices.listAllJobs(queryParams),
    STOP_UGLY_CACHEING
  );

  const { records: jobs = undefined, counts = 0 } = jobsData ?? {};
  const totalPages = Math.ceil(counts / LIMIT);

  return (
    <div className="flex flex-col h-full flex-grow">
      <div className="jobs-cards-container">
        {listRenderFn({
          isLoading,
          list: jobs,
          render: (job) => {
            return <JobCard key={job._id} job={job} mutate={mutate} />;
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
