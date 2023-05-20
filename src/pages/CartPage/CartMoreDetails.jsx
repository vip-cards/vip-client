const { getLocalizedNumber } = require("helpers/lang");
const { default: i18n } = require("locales/i18n");
const { useTranslation } = require("react-i18next");

export default function CartMoreDetails({ cart }) {
  const { t } = useTranslation();
  const lang = i18n.language;
  return (
    <div className="checkout-more capitalize">
      <b className="vendor-title">{t("vendor")}</b>
      <p className="vendor-name">{cart.vendor?.name?.[lang]}</p>
      <b className="branch-title">{t("branch")}</b>
      <p className="branch-name">{cart?.branch?.name?.[lang]}</p>
      <b className="original-price-title">{t("originalPrice")}</b>
      <p className="original-price-value">
        {getLocalizedNumber(cart.price.original, true)}
      </p>
      <b className="original-price-title">{t("discount")}</b>
      <p className="original-price-name">
        {getLocalizedNumber(
          Math.abs(cart.price.original - cart.price.current),
          true
        )}
      </p>
      <b>{t("points")}</b>
      <p>{getLocalizedNumber(cart.points)}</p>
    </div>
  );
}
