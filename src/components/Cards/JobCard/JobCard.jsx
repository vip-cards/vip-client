import dayjs from "dayjs";
import { useNavigate } from "react-router";
import i18n from "../../../locales/i18n";

const JobCard = ({ job }) => {
  const lang = i18n.language;
  const navigate = useNavigate();
  return (
    <div
      key={job._id}
      className="job-card cursor-pointer"
      onClick={() => navigate("/jobs/" + job._id)}
    >
      <h3 className="title">
        {job.companyName[lang] || job.companyName.en || job.companyName.ar}
      </h3>
      <h4 className="sub-title">
        {job.jobTitle[lang] || job.jobTitle.en || job.jobTitle.ar}
      </h4>
      <p className="body">
        <span>{job.address[lang] || job.address.en || job.address.ar}</span>
        <span>{dayjs(job.publishDate).format("DD, MMM")}</span>
      </p>
    </div>
  );
};

export default JobCard;
