import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { useNavigate } from "react-router";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      key={job._id}
      className="job-card cursor-pointer"
      onClick={() => navigate("/حخسفس/" + job._id)}
    >
      <h3 className="title">{getLocalizedWord(job.jobTitle)}</h3>
      <h4 className="sub-title">{getLocalizedWord(job.companyName)}</h4>
      <p className="body">
        <span>{getLocalizedWord(job.address)}</span>
        <span>{dayjs(job.publishDate).format("DD, MMM")}</span>
      </p>
    </div>
  );
};

export default JobCard;
