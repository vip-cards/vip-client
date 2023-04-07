import { listRenderFn } from "helpers/rednerFn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import i18n from "locales/i18n";
import clientServices from "services/clientServices";
import JobCard from "components/Cards/JobCard/JobCard";

export default function ApplyJobHome() {
  const lang = i18n.language;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const {
    data: jobsData,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(["all-jobs", page], ([, page]) =>
    clientServices.listAllJobs({ page })
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
