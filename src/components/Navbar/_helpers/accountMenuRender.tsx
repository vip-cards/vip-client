import { t } from "i18next";
import { Link } from "react-router-dom";

interface INavItem {
  title: string;
  link: string;
  withHover?: boolean;
  withCaret?: boolean;
  menu?: INavItem[];
  render?: (children: any) => JSX.Element;
  listRender?: (menu: INavItem[]) => JSX.Element[];
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function accountMenuRender() {
  return (menu) =>
    menu.map((subItem: INavItem, idx: number) => (
      <li key={subItem.title || "menu-item-" + idx}>
        <Link to={subItem.link} onClick={subItem.onClick} className="block">
          {t(subItem?.title ?? "Menu Item") as string}
        </Link>
      </li>
    ));
}
