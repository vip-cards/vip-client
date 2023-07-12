import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import clientServices from "services/clientServices";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const PostCard = ({ post }) => {
  const currentCLient = localStorage.getItem("userId") ?? "";
  const jobClient = post?.client ?? "";
  const createdByMe = currentCLient === jobClient;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const handleRemoveJob = (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    clientServices
      .removePost(post._id)
      .then(() => {
        toastPopup.success(t("jobRemovedSuccessfully"));
      })
      .catch(responseErrorToast)
      .finally(() => setLoading(false));
  };
  return (
    <motion.div
      layout
      key={post._id}
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 14,
      }}
      className="job-card bg-gray-300 cursor-pointer !gap-2 relative h-[190px]"
      onClick={() => navigate("/posts/" + post._id)}
    >
      {createdByMe && (
        <div className="absolute ltr:right-3 top-3 flex flex-col gap-2 rtl:left-3">
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
      <h4 className="title">{getLocalizedWord(post.name)}</h4>
      <h5 className="sub-title">{getLocalizedWord(post.jobTitle)}</h5>
      <p className="body">
        <span className="leading-5">
          {getLocalizedWord(post.description)} <br /> {post.phone}
        </span>
        <span className="whitespace-nowrap">
          {dayjs(post.publishDate).locale(lang).format("DD, MMM, YYYY")}
        </span>
      </p>
    </motion.div>
  );
};

export default PostCard;
