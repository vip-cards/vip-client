import clsx from "classnames";

import "./CardContainer.scss";

function CardContainer({ children, title, className }) {
  return (
    <main className={clsx(className, "app-card-shadow", "card-container")}>
      {title && (
        <>
          <h1 className="page-title">{title}</h1> <hr />
        </>
      )}
      {children}
    </main>
  );
}

export default CardContainer;
