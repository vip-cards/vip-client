import { faCircleNotch, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton, MainButton } from "components/Buttons";
import CartProduct from "components/CartProduct/CartProduct";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import toastPopup from "helpers/toastPopup";
import i18n from "locales/i18n";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import clientServices from "services/clientServices";
import {
  applyCartCouponThunk,
  flushCart,
  getCurrentCartThunk,
} from "store/cart-slice";
import "./CartPage.scss";

export default function CartPage() {
  const lang = i18n.language;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [showCode, setShowCard] = useState(false);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const cartLoading = cart.loading;
  const [coupon, setCoupon] = useState("");
  function flushCartHandler() {
    dispatch(flushCart(cart._id));
  }

  function handleCheckout() {
    clientServices
      .checkoutCart()
      .then(() => {
        toastPopup.success("Order checkout done!");
        // navigate("/");
        setShowCard(true);
        dispatch(getCurrentCartThunk());
      })
      .catch((e) => {
        toastPopup.error("Something went wrong!");
      });
  }
  function handleCouponApply() {
    dispatch(applyCartCouponThunk({ cartId: cart._id, coupon }));
  }

  useEffect(() => {
    dispatch(getCurrentCartThunk());
  }, []);

  if (cartLoading) return <LoadingSpinner />;

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
            <h4 className="checkout-total-title">Total:</h4>
            <h5 className="total-price">{cart.price.current} LE</h5>
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
            <p className="original-price-value">{cart.price.original} LE</p>
            <b className="original-price-title">{t("discount")}</b>
            <p className="original-price-name">
              {cart.price.original - cart.price.current} LE
            </p>
            <b>{t("points")}</b>
            <p>{cart.points}</p>
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
