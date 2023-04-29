import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavItem({ to, icon, title }) {
  return (
    <li className="nav-item">
      <NavLink to={to} className="nav-link">
        {icon && (
          <span className="nav-icon rounded-full aspect-square h-8 w-8 justify-center items-center flex">
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
        <span className="nav-title capitalize">{title}</span>
      </NavLink>
    </li>
  );
}
