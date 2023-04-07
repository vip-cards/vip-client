import JobCard from "components/Cards/JobCard/JobCard";
import { listRenderFn } from "helpers/rednerFn";
import { useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";

export default function ApplyJobViewCreatedJob() {
  const [page, setPage] = useState(1);
  const {
    data: jobsData,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(["my-created-jobs", page], ([, page]) =>
    clientServices.listAllJobs({ page, client: localStorage.getItem("userId") })
  );

  const { records: jobs = undefined } = jobsData ?? {};

  return (
    <div className="jobs-cards-container ">
      {listRenderFn({
        isLoading,
        list: jobs,
        render: (job) => {
          return <JobCard key={job._id} job={job} />;
        },
      })}
    </div>
  );
}
