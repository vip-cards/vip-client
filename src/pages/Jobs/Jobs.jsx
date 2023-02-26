import { Outlet } from "react-router";
import RoutingTab from "../../components/RoutingTab/RoutingTab";
import "./Jobs.scss";

export default function Jobs() {
  return (
    <div className="jobs-page">
      <RoutingTab
        className="route-switch-container"
        routes={[
          { route: "apply", name: "Apply for a job" },
          { route: "hire", name: "Hiring Employees" },
        ]}
      />
      <Outlet />
    </div>
  );
}
