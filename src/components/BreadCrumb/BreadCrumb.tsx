import {
  faAngleLeft,
  faAngleRight,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type TBreadCrumbProps = {
  pathList: { title: string; link: string }[];
};

const BreadCrumb: React.FC<TBreadCrumbProps> = ({ pathList }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="flex flex-row items-center gap-2 mx-8 my-3 text-gray-400">
      <Link
        to="/"
        className="hover:text-primary text-gray-400 transition-colors"
      >
        <FontAwesomeIcon icon={faHome} />
      </Link>

      {pathList.map((path) => {
        return (
          <Fragment key={path.title + "br-item"}>
            <FontAwesomeIcon
              icon={lang === "ar" ? faAngleLeft : faAngleRight}
              size="sm"
            />
            <Link
              to={path.link}
              className="flex flex-row items-center gap-2 text-gray-400 hover:text-primary transition-colors"
            >
              <span className="text-sm capitalize">{t(path.title)}</span>
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
};

export default BreadCrumb;
