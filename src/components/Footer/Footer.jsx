import {
  faFacebookSquare,
  faInstagramSquare,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import clientServices from "services/clientServices";
import { chatServices } from "services/modules/chatServices";
import { createRoom } from "services/socket/chat";
import { selectAuth } from "store/auth-slice";
import useSWR from "swr";
import "./Footer.scss";

const fetchAllAdmins = () =>
  chatServices.getAdmins().then((data) => data.record);
const fetchAllPages = () => clientServices.listAllPages();
const fetchAllSettings = () => clientServices.listAllSettings();

export default function Footer() {
  const { t } = useTranslation();
  const client = useSelector(selectAuth)?.userData;

  const { data: pages = [] } = useSWR("pages", fetchAllPages);
  const { data: settings = [] } = useSWR("footer-links", fetchAllSettings);
  const { data: adminsList = [] } = useSWR("admin-list", fetchAllAdmins);

  const renderPages = useMemo(
    () =>
      pages?.map((page) => (
        <li key={page._id}>
          <Link
            to={`/page/${page._id}`}
            className="text-white/70 hover:text-white capitalize"
          >
            {t(`footer.${page.type.toLowerCase()}`)}
          </Link>
        </li>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pages]
  );

  const handleCreateSupportChat = () =>
    createRoom({ admin: adminsList?.[0]?._id });

  return (
    <footer className="text-gray-600 body-font bg-primary mt-8 max-sm:leading-6">
      <div className="container px-5 py-12 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="flex-grow flex flex-wrap justify-between flex-row md:pr-20 -mb-10 md:text-left text-center order-first">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium rtl:text-right rtl:font-semibold rtl:tracking-normal text-gray-900 tracking-widest text-sm mb-3 uppercase">
              {t("footer.links")}
            </h2>
            <nav>
              <ul className="list-none mb-10 rtl:text-right">
                {renderPages}
                <li>
                  <button
                    onClick={handleCreateSupportChat}
                    className="text-white/70 hover:text-white capitalize"
                  >
                    {t("footer.chatWithUs")}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          {/* --- SOCIAL LINKS --- */}
          <div className="lg:w-1/4 md:w-1/2 w-fit max-md:w-full px-4">
            <h2 className="title-font font-medium rtl:text-right rtl:font-semibold text-gray-900 rtl:tracking-normal tracking-widest text-sm mb-3">
              {t("footer.followUs")}
            </h2>
            <nav>
              <ul className="list-none mb-10 rtl:text-right mx-auto max-md:w-fit">
                <li>
                  <a
                    className="text-white/70 hover:text-secondary flex flex-row gap-4 items-center"
                    href={settings?.facebook}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faFacebookSquare} />
                    <span>{t("Facebook")}</span>
                  </a>
                </li>
                <li>
                  <a
                    className="text-white/70  items-center  hover:text-secondary flex flex-row gap-4"
                    href={settings?.twitter}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faTwitterSquare} />
                    <span>{t("Twitter")}</span>
                  </a>
                </li>
                <li>
                  <a
                    className="text-white/70  items-center  hover:text-secondary flex flex-row gap-4"
                    href={settings?.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faInstagramSquare} />
                    <span>{t("Instagram")}</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {/* copyright */}
      <div className="border-t border-t-black/30">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
          <p className="text-white/90 font-bold tracking-widest text-sm text-center sm:text-left">
            © {dayjs().year()} VIP store
          </p>
        </div>
      </div>
    </footer>
  );
}
