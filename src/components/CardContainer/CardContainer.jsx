import clsx from "classnames";

import "./CardContainer.scss";
import { Helmet } from "react-helmet-async";
import _ from "lodash";

function CardContainer({ children, title, className }) {
  return (
    <main
      className={clsx(className, "app-card-shadow page-wrapper mt-16 my-8")}
    >
      <Helmet>
        <title>{title ? _.upperFirst(title) : "VIP"}</title>
      </Helmet>

      {title && (
        <>
          <h1 className="page-title">{title}</h1> <hr />
        </>
      )}
      <div className="p-4">{children}</div>
    </main>
  );
}

export default CardContainer;
