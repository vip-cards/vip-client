import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { getLocalizedWord } from "helpers/lang";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import clientServices from "services/clientServices";

type Props = {
  service: IService;
};

const AnimatedLink = motion(Link);

const ServiceCard = (props: Props) => {
  const { service } = props;
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currentCLient = localStorage.getItem("userId") ?? "";

  const createdByMe = currentCLient === service.provider;

  const handleRemoveService = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    clientServices
      .removeService(service._id)
      .then(() => {
        toastPopup.success("Removed successfully!");
      })
      .catch(responseErrorToast)
      .finally(() => setLoading(false));
  };

  const handleEditService = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <AnimatedLink
      layout
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
        type: "spring",
        stiffness: 260,
        damping: 14,
      }}
      key={service._id}
      to={`/services/${service._id}`}
      className={classNames(
        { "opacity-50 animate-pulse pointer-events-none": loading },
        "w-80 p-4 bg-gray-300 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col gap-2 capitalize cursor-pointer relative h-[185px]"
      )}
    >
      {createdByMe && (
        <div className="absolute ltr:right-3 top-3 flex flex-col gap-3 rtl:left-3">
          <button
            type="button"
            className="text-red-800 hover:text-red-600 active:scale-90 transition-transform"
            onClick={handleRemoveService}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      )}
      <h5 className="whitespace-nowrap font-semibold text-primary text-ellipsis">
        {getLocalizedWord(service.providerName)}
      </h5>
      <p className="font-semibold">{getLocalizedWord(service.serviceName)}</p>
      <p className="line-clamp-2 mt-auto">
        {getLocalizedWord(service.description)}
      </p>
      <time dateTime={service.publishDate} className="self-end">
        {dayjs(service.publishDate).locale(lang).format("DD, MMM, YYYY")}
      </time>
    </AnimatedLink>
  );
};

export default ServiceCard;
