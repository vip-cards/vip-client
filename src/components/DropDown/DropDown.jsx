import { useEffect, useRef, useState } from "react";
import "./DropDown.scss";
import classNames from "classnames";
import { useOutsideClick } from "helpers/useOuterClick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

const Dropdown = ({
  menu,
  children,
  right,
  left,
  itemRender,
  listRender,
  className,
  withCaret = false,
  withHover = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef, () => setShowMenu(false));
  const toggleMenu = (event) => {
    switch (event.type) {
      case "mouseenter":
        withHover && setShowMenu(true);
        break;
      case "mouseleave":
        withHover && setShowMenu(false);
        break;
      case "click":
        setShowMenu((state) => !state);
        break;
      default:
        return;
    }
  };

  const TriggerComponent = () => children;

  if (!menu?.length) return <TriggerComponent />;
  const transormX = left ? "-90%" : right ? "-10%" : "-50%";

  return (
    <div
      className={classNames(className, "dropdown-menu", "z-10")}
      onMouseEnter={toggleMenu}
      onMouseLeave={toggleMenu}
      onClick={toggleMenu}
      ref={wrapperRef}
    >
      {children && (
        <span className="flex items-center flex-row">
          <TriggerComponent />
          {withCaret && (
            <FontAwesomeIcon
              icon={showMenu ? faCaretUp : faCaretDown}
              className={`text-white/70 ${
                showMenu ? "animate-up" : "animate-down"
              }`}
            />
          )}
        </span>
      )}
      {showMenu && (
        <ul style={{ transform: `translate(${transormX}, 0)` }}>
          {listRender ? listRender(menu) : menu.map(itemRender)}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
