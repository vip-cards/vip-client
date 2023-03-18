import dayjs from "dayjs";
import { useEffect, useState } from "react";
import i18n from "../../../../locales/i18n";
import clientServices from "../../../../services/clientServices";
import { useNavigate } from "react-router-dom";
import JobCard from "../../JobCard";

export default function ApplyJobHome() {
  const lang = i18n.language;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);

  //TODO: pagination is not working yet
  useEffect(() => {
    setLoading(true);
    clientServices
      .listAllJobs({ page, list: 5 })
      .then((res) => setJobs(res.data.records))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="jobs-cards-container ">
      {loading ? (
        <div>Loading...</div>
      ) : (
        jobs.map((job) => <JobCard job={job} />)
      )}
    </div>
  );
}
