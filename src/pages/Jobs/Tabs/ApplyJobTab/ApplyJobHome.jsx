import dayjs from "dayjs";
import { useEffect, useState } from "react";
import i18n from "../../../../locales/i18n";
import clientServices from "../../../../services/clientServices";

export default function ApplyJobHome() {
  const [page, setPage] = useState(1);
  const lang = i18n.language;

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  //TODO: pagination is not working yet
  useEffect(() => {
    setLoading(true);
    clientServices
      .listAllJobs({ page, list: 5 })
      .then((res) => setJobs(res.data.records))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <div>Home</div>
      <div className="jobs-cards-container ">
        {loading ? (
          <div>Loading...</div>
        ) : (
          jobs.map((item) => (
            <div key={item._id} className="job-card">
              <h3 className="title">
                {item.companyName[lang] ||
                  item.companyName.en ||
                  item.companyName.ar}
              </h3>
              <h4 className="sub-title">
                {item.jobTitle[lang] || item.jobTitle.en || item.jobTitle.ar}
              </h4>
              <p className="body">
                <span>
                  {item.address[lang] || item.address.en || item.address.ar}
                </span>
                <span>{dayjs(item.publishDate).format("DD, MMM")}</span>
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
