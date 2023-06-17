import dayjs from "dayjs";
import "./Footer.scss";

import {
  faFacebookSquare,
  faInstagramSquare,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import clientServices from "services/clientServices";
import { chatServices } from "services/modules/chatServices";

import useSWR from "swr";
import { createRoom } from "services/socket/chat";
import { useSelector } from "react-redux";
import { selectAuth } from "store/auth-slice";

export default function Footer() {
  const { data } = useSWR("admin-list", () => chatServices.getAdmins());
  const adminsList = data?.record ?? [];
  const agent = useSelector(selectAuth);

  const { t } = useTranslation();
  const { data: pages } = useSWR("pages", () => clientServices.listAllPages());
  const { data: settings } = useSWR("footer-links", () =>
    clientServices.listAllSettings()
  );

  return (
    <footer className="text-gray-600 body-font bg-primary mt-8">
      <div className="container px-5 py-12 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="flex-grow flex flex-wrap justify-between flex-row md:pr-20 -mb-10 md:text-left text-center order-first">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium rtl:text-right rtl:font-semibold rtl:tracking-normal text-gray-900 tracking-widest text-sm mb-3 uppercase">
              {t("footer.links")}
            </h2>
            <nav className="list-none mb-10 rtl:text-right">
              {!!pages?.length &&
                pages.map((page) => (
                  <li key={page._id}>
                    <Link
                      to={`/page/${page._id}`}
                      className="text-white/70 hover:text-white capitalize"
                    >
                      {t(`footer.${page.type.toLowerCase()}`)}
                    </Link>
                  </li>
                ))}
              <li>
                <button
                  onClick={() =>
                    createRoom({
                      agent: agent._id,
                      admin: adminsList?.[0]?._id,
                    })
                  }
                  className="text-white/70 hover:text-white capitalize"
                >
                  {t("footer.chatWithUs")}
                </button>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-fit px-4">
            <h2 className="title-font font-medium rtl:text-right rtl:font-semibold text-gray-900 rtl:tracking-normal tracking-widest text-sm mb-3">
              {t("footer.followUs")}
            </h2>
            <nav className="list-none mb-10 w-fit">
              <li>
                <a
                  className="text-white/70 hover:text-secondary flex flex-row gap-4 items-center w-fit"
                  href={settings?.facebook}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FontAwesomeIcon icon={faFacebookSquare} />
                  <span>Facebook</span>
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
                  <span>Twitter</span>
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
                  <span>Instagram </span>
                </a>
              </li>
            </nav>
          </div>
        </div>
      </div>
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
