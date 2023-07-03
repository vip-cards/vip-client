import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useOutsideClick } from "helpers/useOuterClick";
import { useMemo, useRef, useState } from "react";

import "./DropDown.scss";

interface IDropdown {
  menu: any[];
  children?: React.ReactNode;
  right?: boolean;
  left?: boolean;
  itemRender?: (item: any, index: number) => React.ReactNode;
  listRender?: (menu: any[]) => React.ReactNode;
  className?: string;
  withCaret?: boolean;
  withHover?: boolean;
}

const Dropdown: React.FC<IDropdown> = ({
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

  const ulStyle = useMemo(() => {
    const rightTransform = right ? "-2rem" : "-50%";
    const transormX = left ? "-21rem" : rightTransform;

    return { transform: `translate(${transormX},0px) translateZ(0px)` };
  }, [right, left]);

  const TriggerComponent = () => children;

  if (!menu?.length) return <TriggerComponent />;

  return (
    <div
      className={classNames(className, "dropdown-menu z-[500]")}
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
        <ul
          style={ulStyle}
          className="max-h-[75vh] z-50 relative overflow-y-auto transform-gpu max-xs:ltr:!-translate-x-[91.7%] max-xs:rtl:!-translate-x-[8.09%]"
        >
          {listRender ? listRender(menu) : menu.map(itemRender)}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
