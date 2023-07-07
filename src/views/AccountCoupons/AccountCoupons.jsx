import {
  faCoins,
  faCopy,
  faFile,
  faHashtag,
  faNetworkWired,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import STOP_UGLY_CACHEING from "constants/configSWR";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import { listRenderFn } from "helpers/renderFn";
import { useTranslation } from "react-i18next";
import clientServices from "services/clientServices";
import useSWR from "swr";

const fetchCoupons = () =>
  clientServices.listAllCoupons().then((res) => res.records);

const AccountCoupons = () => {
  const { t } = useTranslation();
  const { data: coupons, isLoading } = useSWR(
    "all-coupons",
    fetchCoupons,
    STOP_UGLY_CACHEING
  );

  const renderCoupons = () =>
    listRenderFn({
      isLoading,
      list: coupons,
      render: (coupon) => (
        <div
          className="shadow-md p-4 rounded-md flex flex-col gap-"
          key={coupon._id}
        >
          <div className="flex flex-row justify-between">
            <h5 className="mb-3 text-primary font-semibold">
              {getLocalizedWord(coupon.name)}
            </h5>
            <button
              className="group w-fit relative flex justify-center items-center cursor-pointer"
              onClick={() => {
                // query function to get permission details
                navigator.permissions
                  .query({ name: "clipboard-write" })
                  .then((Status) => {
                    // check if the permission is granted
                    if (Status.state === "granted") {
                      navigator.clipboard
                        .writeText(coupon.code)
                        .then(() =>
                          alert(`Code Copied Successfully : ${coupon.code}`)
                        )
                        .catch(() => alert("Copying failed"));
                    }
                  });
              }}
            >
              <FontAwesomeIcon
                icon={faCopy}
                size="xl"
                className="text-primary group-active:scale-90 transition-transform"
              />
              <span className="w-fit whitespace-nowrap group-hover:opacity-100 -translate-x-1/2 transition-opacity duration-300 bg-primary/70 py-1 px-2 text-sm text-white rounded-md absolute left-1/2 top-1 translate-y-full opacity-0 m-4 mx-auto">
                copy coupon code
              </span>
            </button>
          </div>
          <p className="flex flex-row gap-3 items-center">
            <FontAwesomeIcon icon={faHashtag} className="w-6 text-center" />
            <span>{coupon.code}</span>
          </p>
          <p className="flex flex-row gap-3 items-center">
            <FontAwesomeIcon icon={faFile} className="w-6 text-center" />
            <span>{getLocalizedWord(coupon.description)}</span>
          </p>

          <p className="flex flex-row gap-3 items-center">
            <FontAwesomeIcon icon={faCoins} className="w-6 text-center" />
            <span>
              {t("Value")} :<b>{getLocalizedNumber(coupon.value)}</b>
            </span>
          </p>
          <p className="flex flex-row gap-3 items-center">
            <FontAwesomeIcon
              icon={faNetworkWired}
              className="w-6 text-center"
            />
            <span>
              {t("Quantity")} : <b>{getLocalizedNumber(coupon.quantity)}</b>
            </span>
          </p>
        </div>
      ),
    });

  return (
    <>
      <header className="orders-header">
        <h1 className="text-primary text-center capitalize">{t("coupons")}</h1>
      </header>
      <div className="flex flex-col gap-4">{renderCoupons()}</div>
    </>
  );
};

export default AccountCoupons;
