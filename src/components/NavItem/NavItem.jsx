import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavItem({ to, icon, title }) {
  return (
    <li className="nav-item">
      <NavLink to={to} className="nav-link">
        {icon && (
          <span className="nav-icon">
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
        <span>{title}</span>
      </NavLink>
    </li>
  );
}
