import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as NavbarLogo } from "assets/VIP-ICON-SVG/NavbarLogo.svg";
import { ReactComponent as Notification } from "assets/VIP-ICON-SVG/notification.svg";
import MainImage from "components/MainImage/MainImage";
import ConfirmModal from "components/Modal/ConfirmModal";
import Modal from "components/Modal/Modal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";
import { switchLang } from "helpers/lang";
import { t } from "i18next";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import clientServices from "services/clientServices";
import { markAsSeen } from "services/socket/notification";
import { logout } from "store/actions";
import { selectCartProducts } from "store/cart-slice";
import { selectNotification } from "store/notification-slice";
import Dropdown from "../DropDown/DropDown";
import SideNav from "./SideNav/SideNav";
import { navItemsRender } from "./_helpers/navItemsRender";
import { notificationListRender } from "./_helpers/notificationListRender";

import { authActions } from "store/auth-slice";
import "./Navbar.scss";

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

dayjs.extend(relativeTime);

export default function Navbar() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  const cartProducts = useSelector(selectCartProducts);
  const wishlist = useSelector((state) => (state as any).wishlist);
  const notificationList = useSelector(selectNotification);

  const [lists, setLists] = useState({});
  const [confirmModal, setConfirmModal] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [notificationModal, setNotificationModal] = useState<{
    visible: boolean;
    notification: INotification | null;
  }>({
    visible: false,
    notification: null,
  });

  const lang = i18n.language;

  const setListItem = (item: { categories?: any; vendors?: any }) => {
    setLists((list) => ({ ...list, ...item }));
  };

  const navItems: INavItem[] | any[] = useMemo(
    () => navItemsRender(wishlist, cartProducts, setConfirmModal),
    [cartProducts, wishlist]
  );

  function toggleSideMenu() {
    setShowSideMenu((prevState) => !prevState);
  }

  function logoutHandler(e: MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    logout();
  }

  function handleNotificationClick(
    notificationId: string,
    notification: INotification
  ) {
    setNotificationModal({ visible: true, notification });
    markAsSeen(notificationId);
  }

  const NotificationRing = useCallback(
    () => (
      <Dropdown
        menu={notificationList?.list ?? []}
        left={lang === "en"}
        right={lang === "ar"}
        listRender={notificationListRender(handleNotificationClick)}
      >
        {!!notificationList?.list?.filter((item: INotification) => !item.seen)
          ?.length && (
          <div className="h-5 w-5 flex z-20 p-1 items-center justify-center bg-secondary text-white absolute -right-2 -top-3 rounded-full !text-[0.7rem]">
            {notificationList?.list?.filter((item: INotification) => !item.seen)
              ?.length ?? 0}
          </div>
        )}
        <Notification className="notification-icon hover:drop-shadow-xl hover:bg-white/10 transition-colors rounded-full" />
      </Dropdown>
    ),
    [notificationList?.list, lang]
  );

  useEffect(() => {
    if (showSideMenu) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showSideMenu]);

  useEffect(() => {
    clientServices.categoryQuery({ type: "vendor" }).then((response) => {
      const categoryList = response?.data?.records?.map((item) => ({
        key: item._id,
        _id: item._id,
        to: "categories/" + item._id,
        content: item.name[lang] || item.name.en || item.name.ar,
      }));

      setListItem({ categories: categoryList });
    });

    clientServices.vendorQuery().then((response) => {
      const vendorList = response?.data?.records?.map(
        (item: {
          _id: string;
          name: { [x: string]: any; en: any; ar: any };
        }) => ({
          key: item._id,
          _id: item._id,
          to: "vendors/" + item._id,
          content: item.name[lang] || item.name.en || item.name.ar,
        })
      );

      setListItem({ vendors: vendorList });
    });
    return () => {};
  }, [lang]);

  useEffect(() => {
    clientServices.updateInfo({}).then((data) => {
      dispatch(authActions.update({ userData: data.record }));
    });
  }, [dispatch]);

  return (
    <nav className="top-nav relative z-[900]">
      <FontAwesomeIcon
        icon={faBars}
        size="xl"
        className="text-white hidden max-[1070px]:block hover:text-white/80 cursor-pointer select-none active:scale-95 transition-transform"
        onClick={toggleSideMenu}
      />

      <NavbarLogo
        className="app-logo max-xl:mx-auto"
        onClick={() => {
          navigate("/");
        }}
      />
      <ul className="nav-menu rtl:mr-auto rtl:!ml-0 z-[100]">
        {navItems?.map((item, idx) => {
          const defaultListRender = (menu: any[]) => (
            <>
              {menu
                ?.slice(0, 5)
                ?.map(
                  (
                    subItem: { key: any; to: any; content: any },
                    idx: number
                  ) => (
                    <motion.li
                      transition={{ delay: idx * 0.03 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      key={subItem.key || "menu-item-" + idx}
                    >
                      <Link to={subItem.to || ""} className="block">
                        {subItem.content || "Menu Item"}
                      </Link>
                    </motion.li>
                  )
                )}

              {menu?.length > 5 && (
                <motion.li
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 6 * 0.03 }}
                >
                  <Link to={item.link || ""} className="block">
                    {t("navbar.seeAll") as string} ...
                  </Link>
                </motion.li>
              )}
            </>
          );
          const content = (
            <Dropdown
              key={item.title ?? item.link ?? idx}
              withHover={item.withHover ?? true}
              withCaret={item.withCaret}
              menu={lists[item.title] ?? item.menu ?? undefined}
              listRender={item.listRender ?? defaultListRender}
            >
              <NavLink
                to={item.link}
                className={(navData) =>
                  item.link && navData.isActive
                    ? "active nav-link block"
                    : "nav-link block"
                }
                onClick={item.onClick}
              >
                {t(item.title) as string}
              </NavLink>
            </Dropdown>
          );

          return item.render ? (
            <li key={idx} className="nav-item">
              {item.render(content)}
            </li>
          ) : (
            <li key={idx} className="nav-item">
              {content}
            </li>
          );
        })}
      </ul>

      <div className="notifictation-language">
        <button
          className="lang-btn"
          onClick={() => switchLang(lang === "en" ? "ar" : "en")}
        >
          <>{t("lang")}</>
        </button>
      </div>
      <NotificationRing />

      {showSideMenu && (
        <SideNav
          onToggle={toggleSideMenu}
          items={navItems}
          setConfirmModal={setConfirmModal}
        />
      )}
      <Modal
        visible={notificationModal.visible}
        onClose={() =>
          setNotificationModal({
            visible: false,
            notification: null,
          })
        }
        title={notificationModal.notification?.text}
      >
        <a
          href={notificationModal.notification?.link}
          target="_blank"
          rel="noreferrer"
          className="w-full h-full block"
        >
          <MainImage src={notificationModal.notification?.image?.Location} />
        </a>
      </Modal>
      <ConfirmModal
        visible={confirmModal}
        message={t("YouWillBeLoggedOut")}
        title={"logout"}
        onConfirm={(e) => {
          setConfirmModal(false);
          logoutHandler(e as any);
        }}
        onCancel={() => setConfirmModal(false)}
      />
    </nav>
  );
}
