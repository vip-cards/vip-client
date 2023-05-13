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
import useSWR from "swr";
import { useEffect, useState } from "react";
import { chatServices } from "services/modules/chatServices";
import { createRoom } from "services/socket/chat";

export default function Footer() {
  const [adminsList, setAdminsList] = useState([]);

  const { t } = useTranslation();
  const { data: pages } = useSWR("pages", () => clientServices.listAllPages());
  const { data: settings } = useSWR("footer-links", () =>
    clientServices.listAllSettings()
  );

  useEffect(() => {
    chatServices.getAdmins().then((data) => setAdminsList(data.record));
  });

  return (
    <footer className="text-gray-600 body-font bg-primary mt-8">
      <div className="container px-5 py-12 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        <div className="flex-grow flex flex-wrap justify-between flex-row md:pr-20 -mb-10 md:text-left text-center order-first">
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3 uppercase">
              links
            </h2>
            <nav className="list-none mb-10">
              {!!pages?.length &&
                pages.map((page) => (
                  <li key={page._id}>
                    <Link
                      to={`/page/${page._id}`}
                      className="text-white/70 hover:text-white capitalize"
                    >
                      {t(page.type)}
                    </Link>
                  </li>
                ))}
              <li>
                <button
                  onClick={() => createRoom({ admin: adminsList?.[0]?._id })}
                  className="text-white/70 hover:text-white capitalize"
                >
                  Chat with us
                </button>
              </li>
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-fit px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              Follow Us
            </h2>
            <nav className="list-none mb-10 w-fit">
              <li>
                <a
                  className="text-white/70 hover:text-secondary flex flex-row gap-4 items-center w-fit"
                  href={settings?.facebook}
                >
                  <FontAwesomeIcon icon={faFacebookSquare} />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  className="text-white/70 hover:text-secondary flex flex-row gap-4"
                  href={settings?.twitter}
                >
                  <FontAwesomeIcon icon={faTwitterSquare} />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a
                  className="text-white/70 hover:text-secondary flex flex-row gap-4"
                  href={settings?.instagram}
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
