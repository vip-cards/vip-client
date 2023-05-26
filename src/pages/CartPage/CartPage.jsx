import { faCircleNotch, faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MainButton } from "components/Buttons";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
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
import useSWR from "swr";
import CartMoreDetails from "./CartMoreDetails";
import CartProductsList from "./CartProductsList";
import OrderRequestModal from "./OrderRequestModal";

import axios from "axios";
import classNames from "classnames";
import dayjs from "dayjs";
import clientServices from "services/clientServices";
import "./CartPage.scss";
import { currencyApi } from "helpers";
import Modal from "components/Modal/Modal";

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
    const cnvrtRate = await currencyApi
      .latest({
        base_currency: "EGP",
        currencies: "USD",
      })
      .then(({ data }) => data.USD.value);
    const auth_token = await axios
      .post(
        "https://accept.paymob.com/api/auth/tokens",
        {
          api_key:
            "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TnpreE1USTNMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuY0JyaXE3SWxpN3F6a2x1eEhnSUUwem9VVzN2UlBCMm13OE5RNDZQUGhfT0N1QzhzZl9ob1pja0tjNVlmSEJ5REE4Uk9IYk54ZWJXaG83ekFWZnZ4QVE=",
        }
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${3814034}`,
        //   },
        // }
      )
      .then(({ data }) => data.token);

    const amount_cents = +(amount.toFixed(2) * 100);
    const paymentOrder = await axios
      .post(
        "https://accept.paymob.com/api/ecommerce/orders",
        {
          auth_token,
          delivery_needed: false,
          amount_cents,
          currency: "EGP",
          items: [],
          // merchant_order_id: Math.floor(Math.random() * 99999),
          merchant_order_id: orderId,
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${auth_token}`,
        //   },
        // }
      )
      .then(({ data }) => data);
    console.log(paymentOrder);

    // window.open(paymentUrl, "_blank");
    const paymentToken = await axios
      .post("https://accept.paymob.com/api/acceptance/payment_keys", {
        auth_token,
        expiration: 3600,
        amount_cents,
        currency: "EGP",
        order_id: paymentOrder.id,
        lock_order_when_paid: "false",
        billing_data: {
          first_name: "Clifford",
          last_name: "Nicolas",
          email: "claudette09@exa.com",
          phone_number: "+86(8)9135210487",
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
      <h1 className="title">{t("previousOrdersStatus")}</h1>

      <div className="overflow-hidden overflow-x-auto p-8 x-12 shadow-lg">
        <table className="table-fixed w-full min-w-[60rem]">
          <thead>
            <tr className="divide-slate-900/30 divide-x">
              <th className="text-start pb-2 px-2">Branch</th>
              <th className="text-start w-60 pb-2 px-2">Items</th>
              <th className="text-start w-30 pb-2 px-2">Shipping Fees</th>
              <th className="text-start w-30 pb-2 px-2">Total</th>
              <th className="text-start w-36 pb-2 px-2">Status</th>
              <th className="text-end pb-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody className="border-t border-t-black">
            {requests
              ?.sort((a, b) => (a.status === "pending" ? 0 : -1))
              .map((request) => (
                <>
                  <tr>
                    <td colSpan={6} className="pt-3 font-semibold">
                      {dayjs(request.requestDate).format("DD/MM/YYYY hh:mm A")}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="pt-3 font-medium space-x-4">
                      <FontAwesomeIcon icon={faMap} className="text-primary" />
                      <span>
                        {request.shippingAddress?.city ?? "---"},{" "}
                        {request.shippingAddress?.city ?? "---"},{" "}
                        {request.shippingAddress?.city ?? "---"},{" "}
                        {request.shippingAddress?.city ?? "---"},{" "}
                        {request.shippingAddress?.city ?? "---"}{" "}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-b-gray-300 pb-5 min-h-[7rem] table-row">
                    <td>{getLocalizedWord(request.branch.name)}</td>

                    <td>
                      <ul className="">
                        {request.items.map((item) => (
                          <li
                            key={item.product._id}
                            className="inline-flex divide-x-2 divide-black/40 space-x-2 w-full justify-between"
                          >
                            <p className="max-w-[12rem] whitespace-nowrap overflow-hidden overflow-ellipsis">
                              {getLocalizedWord(item.product.name)}
                            </p>
                            <p className="px-4">{item.quantity}</p>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="text-center">
                      {(!!request.shippingFees &&
                        getLocalizedNumber(request.shippingFees ?? 0, true)) ||
                        "---"}
                    </td>
                    <td>
                      {getLocalizedNumber(
                        +request.total + +(request.shippingFees ?? 0),
                        true
                      )}
                    </td>
                    <td>
                      <span
                        className={classNames("text-sm rounded-md py-1 px-2", {
                          "bg-primary/10 ring-primary/80 ring-2":
                            request.status.includes("accepted"),
                          "bg-red-500/10 ring-red-500/80 ring-2":
                            request.status.includes("rejected"),
                          "bg-yellow-500/10 ring-yellow-500/80 ring-2":
                            request.status.includes("pending"),
                        })}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td className="flex flex-col gap-4 justify-center py-3">
                      <button
                        onClick={() =>
                          handleOrderRequestProceed(
                            request._id,
                            +request.total + +(request.shippingFees ?? 0)
                          )
                        }
                        // onClick={() =>
                        //   handleStatusUpdate({
                        //     client: request.client._id,
                        //     _id: request._id,
                        //     status: `${authRole} accepted`,
                        //   })
                        // }
                        disabled={request.status.includes("pending")}
                        className="disabled:!opacity-20 bg-primary rounded-lg text-white opacity-80 transition-opacity py-1 hover:opacity-100"
                      >
                        Proceed to checkout
                      </button>
                      <button
                        onClick={() =>
                          clientServices
                            .rejectOrderRequest()
                            .then(() => mutate())
                        }
                        className="disabled:!opacity-20 bg-red-500 rounded-lg text-white opacity-80 transition-opacity py-1 hover:opacity-100"
                      >
                        Remove the order
                      </button>
                    </td>
                  </tr>
                </>
              ))}
          </tbody>
        </table>
      </div>
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
            // sandbox="allow-same-origin allow-scripts allow-forms allow-top-navigation"
          ></iframe>
        )}
      </Modal>
    </main>
  );
}
