import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

export default function NavItem({ to, icon, title }) {
  return (
    <li className="nav-item min-w-[6rem] group">
      <NavLink to={to} className="nav-link w-16">
        {icon && (
          <span className="nav-icon rounded-full max-sm:my-2 aspect-square h-8 w-8 justify-center items-center flex">
            <FontAwesomeIcon icon={icon} />
            <span className="tooltip absolute max-sm:!hidden md:!hidden start-[15%] z-50 -translate-x-3 opacity-0 bg-black text-white text-xs py-1 px-2 rounded-md transition-opacity duration-300 group-hover:opacity-100">
              {title}
            </span>
          </span>
        )}
        <span className="nav-title capitalize px-1 !text-sm">{title}</span>
      </NavLink>
    </li>
  );
}
