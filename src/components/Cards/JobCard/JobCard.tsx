import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import clientServices from "services/clientServices";
import { motion } from "framer-motion";

const JobCard = ({ job, mutate }) => {
  const navigate = useNavigate();
  const currentCLient = localStorage.getItem("userId") ?? "";
  const jobClient = job?.client ?? "";
  const createdByMe = currentCLient === jobClient;
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const handleRemoveJob = (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    clientServices
      .removeJob(job._id)
      .then(() => {
        toastPopup.success(t("jobRemovedSuccessfully"));
        mutate && mutate();
      })
      .catch(responseErrorToast)
      .finally(() => setLoading(false));
  };

  return (
    <motion.div
      layout
      key={job._id}
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 14,
      }}
      className="job-card bg-gray-300 cursor-pointer relative h-[170px]"
      onClick={() => navigate("/jobs/" + job._id)}
    >
      {createdByMe && (
        <div className="absolute ltr:right-3 top-3 flex flex-col gap-3 rtl:left-3">
          {/* <button
            className="text-amber-800 hover:text-amber-600 active:scale-90 transition-all duration-75
            "
            onClick={handleUpdateJob}
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
        <span>
          {dayjs(job.publishDate).locale(lang).format("DD, MMM, YYYY")}
        </span>
      </p>
    </motion.div>
  );
};

export default JobCard;
