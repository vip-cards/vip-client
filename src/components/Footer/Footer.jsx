import React from "react";
import "./Footer.scss";
import { ReactComponent as Facebook } from "../../assets/VIP-ICON-SVG/facebook.svg";
import { ReactComponent as Twitter } from "../../assets/VIP-ICON-SVG/twitter.svg";
import { ReactComponent as Instagram } from "../../assets/VIP-ICON-SVG/instagram.svg";
import dayjs from "dayjs";

import useSWR from "swr";
import clientServices from "services/clientServices";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faInstagramSquare,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
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
            </nav>
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
              Follow Us
            </h2>
            <nav className="list-none mb-10">
              <li>
                <a
                  className="text-white/70 hover:text-secondary flex flex-row gap-4"
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
