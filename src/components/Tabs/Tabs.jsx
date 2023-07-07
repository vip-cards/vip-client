import classNames from "classnames";
import { useLocation, useNavigate } from "react-router";
import classes from "./Tabs.module.scss";
import { ProtectedComponent } from "components/auth-components/ProtectedComponent";
import { t } from "i18next";
import { MainButton } from "components/Buttons";
import { useState } from "react";

/**
 * It takes an object of tabs `{label, panel}`, and a default tab.
 * @returns The return value of the function is the JSX that is rendered.
 */
export default function Tabs({ tabs, defaultTab }) {
  const location = useLocation();
  const navigate = useNavigate();

  let [tab, setTab] = useState(Object.keys(tabs)[0]);
  // const tab = location?.state?.openedTap ?? defaultTab ?? Object.keys(tabs)[0];

  return (
    <div className={classes["tabs-container"]}>
      <div className={classNames(classes["tab-btns"], "flex-col")}>
        {Object.entries(tabs).map(([key, { label, role }]) => (
          <ProtectedComponent key={key} role={role}>
            <MainButton
              active={tab === key}
              className="whitespace-nowrap max-sm:w-full"
              onClick={() => {
                setTab(key);
                // navigate(location.pathname, {
                //   state: {
                //     openedTap: key,
                //   },
                // });
              }}
            >
              {t(label)}
            </MainButton>
          </ProtectedComponent>
        ))}
      </div>
      <div className="tab-container">{tabs[tab].panel}</div>
    </div>
  );
}
