import clsx from "classnames";

import "./CardContainer.scss";

function CardContainer({ children, title, className }) {
  return (
    <main
      className={clsx(className, "app-card-shadow page-wrapper mt-16 my-8")}
    >
      {title && (
        <>
          <h1 className="page-title">{title}</h1> <hr />
        </>
      )}
      <div className="p-4">

      {children}
      </div>
    </main>
  );
}

export default CardContainer;
