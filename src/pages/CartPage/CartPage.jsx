import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MainButton } from "components/Buttons";
import CardContainer from "components/CardContainer/CardContainer";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import Modal from "components/Modal/Modal";
import NoData from "components/NoData/NoData";
import { getLocalizedNumber } from "helpers/lang";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import clientServices from "services/clientServices";
import paymobServices from "services/paymob.services";
import { selectUserData } from "store/auth-slice";
import {
  applyCartCouponThunk,
  getCurrentCartThunk,
  selectCart,
} from "store/cart-slice";
import useSWR from "swr";
import CartMoreDetails from "./CartMoreDetails";
import CartProductsList from "./CartProductsList";
import OrderRequestModal from "./OrderRequestModal";

import "./CartPage.scss";

const initialPaymentModal = { open: false, url: "" };

const fetchOrderRequests = () =>
  clientServices.getOrdersRequests().then((res) => res.records);

export default function CartPage() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const cart = useSelector(selectCart);
  const userData = useSelector(selectUserData);
  const cartLoading = cart.loading;

  const [coupon, setCoupon] = useState("");
  const [showCode, setShowCard] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(initialPaymentModal);

  const { data: requests = [], mutate } = useSWR(
    "all-order-requests",
    fetchOrderRequests
  );

  function handleCouponApply() {
    dispatch(applyCartCouponThunk({ cartId: cart._id, coupon }));
  }

  async function handleOrderRequestProceed(orderId, amount) {
    const url = await paymobServices.paymobProcessURL(amount, orderId);
    setPaymentModal({ open: true, url });
  }

  useEffect(() => {
    dispatch(getCurrentCartThunk());

    const timer = setInterval(() => {
      showCode && dispatch(getCurrentCartThunk());
    }, 5000);

    return () => clearInterval(timer);
  }, [dispatch, showCode]);

  if (cartLoading && !cart) return <LoadingSpinner />;

  if (!cart._id) return <NoData />;

  return (
    <CardContainer className="cart-page">
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
            <div className="w-full p-2 border rounded-lg flex focus-within:border-blue-500 flex-row flex-wrap justify-between mb-3 overflow-hidden">
              <input
                className="outline-none ring-0 border-0 "
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.currentTarget.value)}
              />
              <MainButton
                disabled={userData.usedFreeTrial && !userData.isSubscribed}
                className="!text-xs !h-7 px-2 whitespace-nowrap"
                onClick={handleCouponApply}
              >
                {t("applyCoupon")}{" "}
              </MainButton>
            </div>

            <button
              className="checkout-btn disabled:opacity-40 disabled:!cursor-default"
              disabled={
                cartLoading ||
                !cart?.products?.length ||
                (userData.usedFreeTrial && !userData.isSubscribed)
              }
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
                !cart?.branch?.hasDelivery ||
                (userData.usedFreeTrial && !userData.isSubscribed)
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
                <p>{+cart.price.current - +cart.coupon.value}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* --------------------------------- */}

      <OrderRequestModal
        showModal={showModal}
        setShowModal={setShowModal}
        hasOnlinePayment={cart?.vendor?.hasOnlinePayment}
      />
      <Modal
        className="w-screen h-screen"
        visible={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, url: "" })}
      >
        {paymentModal.url && (
          <iframe
            title="payment"
            src={paymentModal.url}
            width="100%"
            height="100%"
            frameBorder="0"
          ></iframe>
        )}
      </Modal>
    </CardContainer>
  );
}
