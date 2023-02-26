import { useState } from "react";
import { Link } from "react-router-dom";
import "./DropDown.scss";

const Dropdown = ({ menu, children }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (event) => {
    // toggling it only, make sum uncontrolled behave
    if (event.type === "mouseenter") setShowMenu(true);
    else if (event.type === "mouseleave") setShowMenu(false);
  };

  const TriggerComponent = () => children;
  if (!menu?.length) return <TriggerComponent />;

  return (
    <div
      className="dropdown-menu"
      onMouseEnter={toggleMenu}
      onMouseLeave={toggleMenu}
    >
      {children && <TriggerComponent />}
      {showMenu && (
        <ul>
          {menu.map((item, idx) => (
            <li key={item.key || "menu-item-" + idx}>
              <Link to={item.to || ""}>{item.content || "Menu Item"}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
