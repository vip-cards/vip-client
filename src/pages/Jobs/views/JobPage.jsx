import { useEffect, useState } from "react";
import { useParams } from "react-router";
import i18n from "../../../locales/i18n";
import clientServices from "../../../services/clientServices";

export default function JobPage() {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const lang = i18n.language;
  console.log(id);

  useEffect(() => {
    clientServices.getJobDetails(id).then(({ data }) => setJob(data.record[0]));
  }, []);
  return (
    <main className="job-details-page">
      <h2>
        {job?.companyName?.[lang] ||
          job?.companyName?.en ||
          job?.companyName?.ar}
      </h2>
      <h3>{job?.jobTitle?.[lang] || job?.jobTitle?.en || job?.jobTitle?.ar}</h3>
      <h4>
        {job?.description?.[lang] ||
          job?.description?.en ||
          job?.description?.ar}
      </h4>
      <h5>{job?.address?.[lang] || job?.address?.en || job?.address?.ar}</h5>
    </main>
  );
}
