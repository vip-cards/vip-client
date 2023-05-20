import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MainButton } from "components/Buttons";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import { getLocalizedNumber } from "helpers/lang";
import i18n from "locales/i18n";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "store/auth-slice";
import {
  applyCartCouponThunk,
  getCurrentCartThunk,
  selectCart,
} from "store/cart-slice";
import CartMoreDetails from "./CartMoreDetails";
import CartProductsList from "./CartProductsList";
import OrderRequestModal from "./OrderRequestModal";

import "./CartPage.scss";

export default function CartPage() {
  const lang = i18n.language;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userData = useSelector(selectUserData);
  const cart = useSelector(selectCart);
  const cartLoading = cart.loading;

  const [showCode, setShowCard] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [showModal, setShowModal] = useState(false);

  function handleCouponApply() {
    dispatch(applyCartCouponThunk({ cartId: cart._id, coupon }));
  }

  useEffect(() => {
    dispatch(getCurrentCartThunk());

    const timer = setInterval(() => {
      showCode && dispatch(getCurrentCartThunk());
    }, 5000);

    return () => clearInterval(timer);
  }, [showCode]);

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
        <CartProductsList cart={cart} />

        <div className="cart-summary rtl:!border-l-0 rtl:border-r-black rtl:border-r">
          <div className="checkout-summary">
            <h3 className="checkout-title">{t("checkout")}</h3>
            <h4 className="checkout-total-title capitalize">{t("total")}:</h4>
            <h5 className="total-price">
              {getLocalizedNumber(cart.price.current, true)}
            </h5>

            {/* Actions */}
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
              className="checkout-btn disabled:opacity-40 disabled:!cursor-default"
              disabled={cartLoading || !cart?.products?.length}
              onClick={() => setShowCard(true)}
            >
              {cartLoading ? (
                <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
              ) : (
                <>{t("orderFromBranch")}</>
              )}
            </button>

            <button
              className="checkout-btn disabled:opacity-40 disabled:!cursor-default"
              disabled={
                cartLoading ||
                !cart?.products?.length ||
                !cart?.branch?.hasDelivery
              }
              onClick={() => setShowModal(true)}
            >
              {cartLoading ? (
                <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
              ) : (
                <>{t("orderOnline")}</>
              )}
            </button>
            {showCode && <Barcode value={userData.barcode} />}
          </div>

          <CartMoreDetails cart={cart} />

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
      <OrderRequestModal showModal={showModal} setShowModal={setShowModal} />
    </main>
  );
}
