import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import { useState } from "react";
import { useNavigate } from "react-router";
import clientServices from "services/clientServices";

const JobCard = ({ job, mutate }) => {
  const navigate = useNavigate();
  const currentCLient = localStorage.getItem("userId") ?? "";
  const jobClient = job?.client ?? "";
  const createdByMe = currentCLient === jobClient;
  const [loading, setLoading] = useState(false);

  const handleRemoveJob = (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    clientServices
      .removeJob(job._id)
      .then(() => {
        toastPopup.success("Job removed successfully!");
        mutate && mutate();
      })
      .finally(() => setLoading(false));
  };
  return (
    <div
      key={job._id}
      className="job-card cursor-pointer relative h-[150px]"
      onClick={() => navigate("/jobs/" + job._id)}
    >
      {createdByMe && (
        <div className="absolute ltr:right-3 top-3 flex flex-col gap-3 rtl:left-3">
          {/* <button
            className="text-amber-800 hover:text-amber-600 active:scale-90 transition-all duration-75
            "
            onClick={handleRemoveJob}
          >
            <FontAwesomeIcon icon={faPencil} />
          </button> */}
          <button
            className="text-red-800 hover:text-red-600 active:scale-90 transition-transform"
            onClick={handleRemoveJob}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      )}
      <h3 className="title whitespace-nowrap overflow-ellipsis overflow-hidden text-2xl">
        {getLocalizedWord(job.jobTitle)}
      </h3>
      <h4 className="sub-title text-xl">{getLocalizedWord(job.companyName)}</h4>
      <p className="body">
        <span>{getLocalizedWord(job.address)}</span>
        <span>{dayjs(job.publishDate).format("DD, MMM")}</span>
      </p>
    </div>
  );
};

export default JobCard;
