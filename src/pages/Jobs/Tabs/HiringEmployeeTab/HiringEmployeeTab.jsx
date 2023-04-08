import classNames from "classnames";
import { NavLink, Outlet } from "react-router-dom";

const HiringEmployeeTab = () => {
  const btnClass = ({ isActive }) =>
    classNames("subroute-btn", { active: isActive });
  return (
    <div className="page-wrapper app-card-shadow px-0 md:px-5 lg:px-8 py-8 m-8">
      <div>HiringEmployeeTab</div>
      <div className="subroute-container">
        <NavLink to="home" className={btnClass}>
          Home
        </NavLink>
        <NavLink to="create" className={btnClass}>
          create job
        </NavLink>
        <NavLink to="view-created" className={btnClass}>
          view created job
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default HiringEmployeeTab;
