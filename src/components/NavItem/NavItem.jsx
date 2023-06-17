import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavItem({ to, icon, title }) {
  return (
    <li className="nav-item min-w-[6rem]">
      <NavLink to={to} className="nav-link w-16">
        {icon && (
          <span className="nav-icon rounded-full max-sm:my-2 aspect-square h-8 w-8 justify-center items-center flex">
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
        <span className="nav-title capitalize px-1 !text-sm">{title}</span>
      </NavLink>
    </li>
  );
}
