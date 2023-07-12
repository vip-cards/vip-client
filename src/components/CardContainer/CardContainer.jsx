import clsx from "classnames";
import _ from "lodash";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import "./CardContainer.scss";

function CardContainer({ children, title, className, withHeader = true }) {
  const { t } = useTranslation();
  const smallTitle = title?.toLowerCase() ?? "";

  return (
    <main
      className={clsx(
        className,
        "app-card-shadow page-wrapper max-sm:!max-w-full mt-16 my-8 max-sm:!m-0 max-sm:!w-full max-sm:!rounded-none"
      )}
    >
      <Helmet>
        <title>{title ? _.upperFirst(t(smallTitle)) : "VIP"}</title>
      </Helmet>

      {!!title && withHeader && (
        <>
          <h1 className="page-title">{t(smallTitle)}</h1> <hr />
        </>
      )}
      <div className="p-4">{children}</div>
    </main>
  );
}

export default CardContainer;
