import { faCircleNotch, faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import classNames from "classnames";
import { MainButton } from "components/Buttons";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import Modal from "components/Modal/Modal";
import NoData from "components/NoData/NoData";
import dayjs from "dayjs";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import i18n from "locales/i18n";
import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import clientServices from "services/clientServices";
import { selectUserData } from "store/auth-slice";
import {
  applyCartCouponThunk,
  getCurrentCartThunk,
  selectCart,
} from "store/cart-slice";
import useSWR from "swr";
import CartMoreDetails from "./CartMoreDetails";
import "./CartPage.scss";
import CartProductsList from "./CartProductsList";
import OrderRequestModal from "./OrderRequestModal";
import OrderRequestsTable from "./OrderRequestsTable";

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
  const [paymentModal, setPaymentModal] = useState({ open: false, url: "" });

  const { data: requestsData = {}, mutate } = useSWR("all-order-requests", () =>
    clientServices.getOrdersRequests()
  );
  const requests = requestsData?.records ?? [];

  function handleCouponApply() {
    dispatch(applyCartCouponThunk({ cartId: cart._id, coupon }));
  }

  async function handleOrderRequestProceed(orderId, amount) {
    const auth_token = await axios
      .post("https://accept.paymob.com/api/auth/tokens", {
        api_key:
          "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TnpreE1USTNMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuY0JyaXE3SWxpN3F6a2x1eEhnSUUwem9VVzN2UlBCMm13OE5RNDZQUGhfT0N1QzhzZl9ob1pja0tjNVlmSEJ5REE4Uk9IYk54ZWJXaG83ekFWZnZ4QVE=",
      })
      .then(({ data }) => data.token);

    const amount_cents = +(amount.toFixed(2) * 100);
    const paymentOrder = await axios
      .post("https://accept.paymob.com/api/ecommerce/orders", {
        auth_token,
        delivery_needed: false,
        amount_cents,
        currency: "EGP",
        items: [],
        merchant_order_id: orderId,
      })
      .then(({ data }) => data);

    const paymentToken = await axios
      .post("https://accept.paymob.com/api/acceptance/payment_keys", {
        auth_token,
        expiration: 3600,
        amount_cents,
        currency: "EGP",
        order_id: paymentOrder.id,
        lock_order_when_paid: "false",
        billing_data: {
          first_name: userData.name.en.split(" ")[0],
          last_name: userData.name.en.split(" ")[1],
          email: userData.email,
          phone_number: userData.phone,
          street: "NA",
          building: "NA",
          apartment: "NA",
          floor: "NA",
          shipping_method: "NA",
          postal_code: "NA",
          city: "NA",
          country: "NA",
          state: "NA",
        },
        integration_id: 3814034,
      })
      .then(({ data }) => data.token);

    setPaymentModal({
      open: true,
      url: `https://accept.paymob.com/api/acceptance/iframes/760110?payment_token=${paymentToken}`,
    });
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
      {/* --------------------------------- */}

      <OrderRequestsTable
        requests={requests}
        handleOrderRequestProceed={handleOrderRequestProceed}
        refetch={mutate}
      />

      <OrderRequestModal showModal={showModal} setShowModal={setShowModal} />
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
    </main>
  );
}
