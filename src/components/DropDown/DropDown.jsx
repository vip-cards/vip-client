import { useState } from "react";
import "./DropDown.scss";

const Dropdown = ({ menu, children, right, left, itemRender, listRender }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (event) => {
    // toggling it only, make sum uncontrolled behave
    if (event.type === "mouseenter") setShowMenu(true);
    else if (event.type === "mouseleave") setShowMenu(false);
  };

  const TriggerComponent = () => children;
  if (!menu?.length) return <TriggerComponent />;
  const transormX = left ? "-90%" : right ? "-10%" : "-50%";

  return (
    <div
      className="dropdown-menu"
      onMouseEnter={toggleMenu}
      onMouseLeave={toggleMenu}
    >
      {children && <TriggerComponent />}
      {showMenu && (
        <ul style={{ transform: `translate(${transormX}, 0)` }}>
          {listRender ? listRender(menu) : menu.map(itemRender)}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
