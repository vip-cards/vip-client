import classNames from "classnames";
import { useState } from "react";
import classes from "./Tabs.module.scss";

/**
 * It takes an object of tabs `{label, panel}`, and a default tab.
 * @returns The return value of the function is the JSX that is rendered.
 */
export default function Tabs({ tabs, defaultTab }) {
  const [tab, setTab] = useState(defaultTab || Object.keys(tabs)[0]);

  return (
    <div className={classes["tabs-container"]}>
      <div className={classes["tab-btns"]}>
        {Object.entries(tabs).map(([key, { label }]) => (
          <button
            key={key}
            active={tab === key}
            className={classNames(classes["btn"], {
              [classes["active"]]: tab === key,
            })}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="tab-container">{tabs[tab].panel}</div>
    </div>
  );
}
