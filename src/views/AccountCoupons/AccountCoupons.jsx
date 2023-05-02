import {
  faCoins,
  faFile,
  faHashtag,
  faNetworkWired,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getLocalizedWord } from "helpers/lang";
import { listRenderFn } from "helpers/rednerFn";
import { t } from "i18next";
import clientServices from "services/clientServices";
import useSWR from "swr";

const AccountCoupons = () => {
  const {
    data: couponsData,
    error,
    isLoading,
    isValidating,
  } = useSWR("all-coupons", () => clientServices.listAllCoupons());

  const { records: coupons = undefined, counts = 0 } = couponsData ?? {};

  const renderCoupons = () =>
    listRenderFn({
      isLoading,
      list: coupons,
      render: (coupon) => (
        <div className="shadow-md p-4 rounded-md" key={coupon._id}>
          <h5 className="mb-3">{getLocalizedWord(coupon.name)}</h5>{" "}
          <p className="flex flex-row gap-3 items-center">
            <FontAwesomeIcon icon={faFile} className="w-6 text-center" />
            <span>{getLocalizedWord(coupon.description)}</span>
          </p>
          <p className="flex flex-row gap-3 items-center">
            <FontAwesomeIcon icon={faHashtag} className="w-6 text-center" />
            <span>{getLocalizedWord(coupon.code)}</span>
          </p>
          <p className="flex flex-row gap-3 items-center">
            <FontAwesomeIcon icon={faCoins} className="w-6 text-center" />
            <span>{getLocalizedWord(coupon.value)}</span>
          </p>
          <p className="flex flex-row gap-3 items-center">
            <FontAwesomeIcon
              icon={faNetworkWired}
              className="w-6 text-center"
            />
            <span>{getLocalizedWord(coupon.quantity)}</span>
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
