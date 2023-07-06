import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import Modal from "components/Modal/Modal";
import NoData from "components/NoData/NoData";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import clientServices from "services/clientServices";

function ClientSection({ title = "", children }) {
  const { t } = useTranslation();
  return (
    <section className="border border-primary/70 p-3 w-full min-h-[7rem] rounded-lg">
      <header className="mb-3">
        <h5 className="text-primary !text-md font-semibold">{t(title)}</h5>
      </header>
      <article>{children}</article>
    </section>
  );
}

function ClientOrder({
  request: requestDetails,
  refetch,
  availablePoints,
  handlePaymobProcced,
}) {
  const { t } = useTranslation();
  const [resPoints, setResPoints] = useState({ vendor: 0, vip: 0 });
  const navigate = useNavigate();

  function getMyServices() {
    return clientServices;
  }

  if (!requestDetails) return null;

  const { client, coupon, total: cartTotal } = requestDetails;

  const vendorAvailablePoints = availablePoints.vendor ?? 0;
  const vipAvailablePoints = availablePoints.vip ?? 0;

  async function applyCouponHandler() {
    try {
      let data = await getMyServices().applyCouponFinally(
        requestDetails._id,
        coupon.code
      );
      toastPopup.success("success");
      refetch();
    } catch (responseErrorToast) {}
  }

  async function rejecctCouponHandler() {
    try {
      let data = await getMyServices().rejectCoupon(requestDetails._id);
      toastPopup.success("success");
      refetch();
    } catch (responseErrorToast) {}
  }
  function applyVendorPoint(e) {
    e.preventDefault();
    getMyServices()
      .useVendorPoints(resPoints.vendor, {
        client: client._id,
        vendor: requestDetails.vendor._id,
        request: requestDetails._id,
      })
      .then((e) => {
        toastPopup.success("success");
        refetch();
      });
  }
  function applyVipPoint(e) {
    e.preventDefault();
    getMyServices()
      .useSystemPoints(resPoints.vip, {
        client: client._id,
        request: requestDetails._id,
      })
      .then((e) => {
        toastPopup.success("success");
        refetch();
      })
      .catch(responseErrorToast);
  }

  function checkoutCart() {
    getMyServices()
      .checkout({
        client: client._id,
        status: "pending",
        request: requestDetails._id,
        purchaseDate: new Date(Date.now()),
      })
      .then((e) => {
        clientServices.acceptOrder(requestDetails._id).then((e) => {
          toastPopup.success("success");
          navigate(0);
        });
      })
      .catch(responseErrorToast);
  }
  function applyFreeTrialCart() {
    getMyServices()
      .useFreeTrial({
        client: client._id,
        status: "pending",
        request: requestDetails._id,
        purchaseDate: new Date(Date.now()),
      })
      .then((e) => {
        clientServices.acceptOrder(requestDetails._id).then((e) => {
          toastPopup.success("success");
          navigate(0);
        });
      })
      .catch(responseErrorToast);
  }

  return (
    <div className="flex flex-col gap-3 " key={requestDetails._id}>
      {/* order details section */}

      <ClientSection title="clientDetails">
        <div className="flex flex-col gap-4">
          <p className="flex flex-row gap-3">
            <span>{t("Vendor Points")}</span>
            {" : "}
            <span className="font-semibold">
              {getLocalizedNumber(vendorAvailablePoints)}
            </span>
          </p>
          <p className="flex flex-row gap-3">
            <span>{t("VIP points")}</span>
            {" : "}
            <span className="font-semibold">
              {getLocalizedNumber(vipAvailablePoints)}
            </span>
          </p>
          <p className="flex flex-row gap-3">
            <span className="">
              {client?.usedFreeTrial
                ? t("Used free Trial")
                : t("didnotUsedFreeTrial")}
            </span>
          </p>
        </div>
      </ClientSection>

      {(vendorAvailablePoints > 0 || availablePoints.vip > 0) && (
        <ClientSection title="Points Details">
          <div className="flex flex-col gap-8 my-5">
            {vendorAvailablePoints > 0 && (
              <form
                className="flex flex-row gap-3 w-full"
                onSubmit={applyVendorPoint}
              >
                <MainInput
                  className="grow"
                  state={resPoints}
                  name="vendor"
                  type="number"
                  min="0"
                  max={vendorAvailablePoints}
                  setState={setResPoints}
                />
                <MainButton type="submit" text="apply" className="!text-base" />
              </form>
            )}
            {vipAvailablePoints > 0 && (
              <form
                className="flex flex-row gap-3 w-full"
                onSubmit={applyVipPoint}
              >
                <MainInput
                  className="grow"
                  state={resPoints}
                  name="vip"
                  type="number"
                  min="0"
                  max={vipAvailablePoints}
                  setState={setResPoints}
                />
                <MainButton type="submit" text="apply" className="!text-base" />
              </form>
            )}
          </div>
        </ClientSection>
      )}

      {coupon && (
        <ClientSection title="Coupon Details">
          <div className="flex flex-col gap-8 my-5">
            <div className="flex flex-col gap-4">
              <p className="flex flex-row gap-3">
                <span>{t("Coupon Name")}</span>
                {" : "}
                <span className="font-semibold">
                  {getLocalizedWord(coupon?.name)}
                </span>
              </p>
              <p className="flex flex-row gap-3">
                <span>{t("Coupon Value")}</span>
                {" : "}
                <span className="font-semibold">
                  {getLocalizedNumber(coupon.value)}
                </span>
              </p>
            </div>

            <form className="flex flex-row gap-3 w-full">
              <MainInput
                className="grow"
                state={{ "Coupon Code": coupon?.code }}
                name="Coupon Code"
                type="text"
                disabled={true}
              />
              {requestDetails.isCouponApplied === true ? (
                <h6 className="font-semibold text-primary/95 flex items-center justify-center">
                  {t("Coupon Applied")}
                </h6>
              ) : (
                <>
                  {" "}
                  <MainButton
                    type="button"
                    text="remove"
                    className="!text-base"
                    onClick={() => {
                      rejecctCouponHandler();
                    }}
                  />
                  <MainButton
                    type="button"
                    text="apply"
                    className="!text-base"
                    onClick={() => {
                      applyCouponHandler();
                    }}
                  />
                </>
              )}
            </form>
          </div>
        </ClientSection>
      )}

      <ClientSection title="Total Cart Amount">
        <div className="flex flex-col gap-8 my-5">
          <div className="flex flex-row justify-between">
            <h4 className="capitalize">{t("total")}</h4>
            <h4 className="capitalize">
              {getLocalizedNumber(cartTotal, true)}
            </h4>
          </div>
        </div>
      </ClientSection>

      <footer className="flex flex-row flex-wrap justify-around gap-4">
        {!client?.usedFreeTrial && (
          <MainButton
            type="button"
            text="useFreeTrial"
            className="!text-base w-[9rem] max-sm:!w-full"
            onClick={() => {
              requestDetails.paymentMethod === "cash on delivery" ||
              cartTotal === 0
                ? applyFreeTrialCart()
                : handlePaymobProcced(
                    requestDetails._id,
                    cartTotal,
                    "useFreeTrial"
                  );
            }}
          />
        )}
        {client?.isSubscribed && (
          <MainButton
            type="button"
            text="checkout"
            className="!text-base w-[9rem] max-sm:!w-full"
            onClick={() => {
              requestDetails.paymentMethod === "cash on delivery" ||
              cartTotal === 0
                ? checkoutCart()
                : handlePaymobProcced(
                    requestDetails._id,
                    cartTotal,
                    "checkout"
                  );
            }}
          />
        )}
      </footer>
    </div>
  );
}

export default function OrderCheckoutModal({
  request = undefined,
  visible = false,
  onClose = () => {},
  handlePaymobProcced = () => {},
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.auth.userId);
  const [requestDetails, setRequestDetails] = useState({});
  const [points, setPoints] = useState({});

  async function getRequestDataHandler() {
    try {
      setLoading(true);
      const requstData =
        request && (await clientServices.getOrdersRequest(request._id, userId));

      setRequestDetails(requstData?.records?.[0]);
      // setClientData(requstData?.records?.[0]?.client);
      console.log(requstData);
      const pointsData =
        request &&
        (await clientServices.getClientPoints(userId, request?.vendor?._id));
      setPoints({
        vip: pointsData?.record?.vipPoints,
        vendor: pointsData?.record?.vendorPoints?.[0]?.availablePoints,
      });
    } catch (responseErrorToast) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (request) {
      getRequestDataHandler();
    }
  }, [request]);
  return (
    <Modal
      className="w-screen h-screen"
      visible={visible}
      onClose={() => {
        onClose();
      }}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ClientOrder
            request={requestDetails}
            refetch={getRequestDataHandler}
            availablePoints={points}
            handlePaymobProcced={handlePaymobProcced}
          />
        </>
      )}
    </Modal>
  );
}
