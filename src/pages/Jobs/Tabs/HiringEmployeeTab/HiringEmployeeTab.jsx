import classNames from "classnames";
import { NavLink, Outlet } from "react-router-dom";

const HiringEmployeeTab = () => {
  const btnClass = ({ isActive }) =>
    classNames("subroute-btn", { active: isActive });
  return (
    <>
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
    </>
  );
};

export default HiringEmployeeTab;
