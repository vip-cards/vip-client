import { faCircleNotch, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, MainButton } from "components/Buttons";
import CartProduct from "components/CartProduct/CartProduct";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import i18n from "locales/i18n";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import clientServices from "services/clientServices";
import {
  applyCartCouponThunk,
  flushCart,
  getCurrentCartThunk,
  selectCart,
} from "store/cart-slice";
import "./CartPage.scss";
import { getLocalizedNumber } from "helpers/lang";

export default function CartPage() {
  const lang = i18n.language;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.userData);
  const cart = useSelector(selectCart);
  const cartLoading = cart.loading;

  const [showCode, setShowCard] = useState(false);
  const [coupon, setCoupon] = useState("");

  function flushCartHandler() {
    dispatch(flushCart(cart._id));
  }

  function handleCheckout() {
    clientServices
      .checkoutCart()
      .then(() => {
        toastPopup.success("Order checkout done!");
        setShowCard(true);
        dispatch(getCurrentCartThunk());
      })
      .catch(responseErrorToast);
  }
  function handleCouponApply() {
    dispatch(applyCartCouponThunk({ cartId: cart._id, coupon }));
  }

  useEffect(() => {
    dispatch(getCurrentCartThunk());
  }, []);

  if (cartLoading && !cart) return <LoadingSpinner />;

  if (!cart._id) return <NoData />;

  return (
    <main className="app-card-shadow cart-page">
      <Helmet>
        <title>{t("shoppingCart")}</title>
      </Helmet>
      <h1 className="title">{t("shoppingCart")}</h1>
      <h2 className="cart-branch">{cart?.branch?.name?.[lang]}</h2>
      <div className="cart-container">
        <div className="cart-details">
          <div className="w-full flex flex-row">
            <MainButton
              size="small"
              className="ml-auto !rounded-lg w-fit !h-8 flex ltr:flex-row rtl:flex-row-reverse justify-center items-center gap-2 !px-4 !py-2 !bg-red-700 !text-white"
              onClick={flushCartHandler}
            >
              <span>{t("clearCart")}</span>
              <IconButton icon={faTrashCan} />
            </MainButton>
          </div>
          {cart.products.map((item) => (
            <CartProduct
              key={item._id}
              item={{ ...item, branchId: cart.branch._id }}
            />
          ))}
        </div>

        <div className="cart-summary rtl:!border-l-0 rtl:border-r-black rtl:border-r">
          <div className="checkout-summary">
            <h3 className="checkout-title">{t("checkout")}</h3>
            <h4 className="checkout-total-title capitalize">{t("total")}:</h4>
            <h5 className="total-price">
              {getLocalizedNumber(cart.price.current, true)}
            </h5>
            <div className="w-full p-2 border rounded-lg flex focus-within:border-blue-500 flex-row justify-between mb-3">
              <input
                className="outline-none ring-0 border-0 "
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.currentTarget.value)}
              />
              <MainButton
                className="!text-xs !h-7 px-2 whitespace-nowrap"
                onClick={handleCouponApply}
              >
                {t("applyCoupon")}{" "}
              </MainButton>
            </div>
            <button
              className="checkout-btn"
              disabled={cartLoading}
              onClick={handleCheckout}
            >
              {cartLoading ? (
                <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
              ) : (
                <>{t("orderFromBranch")}</>
              )}
            </button>
            {showCode && <Barcode value={userData.barcode} />}
          </div>
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
          {cart?.coupon && (
            <div>
              <h5>Coupon</h5>
              <div className="flex flex-row justify-between">
                <h6 className="font-semibold">Code</h6>
                <p>{cart.coupon.code}</p>
              </div>
              <div className="flex flex-row justify-between">
                <h6 className="capitalize font-semibold">total after coupon</h6>
                <p>{cart.coupon.value}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div></div>
    </main>
  );
}
