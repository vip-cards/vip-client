import {
  faBuilding,
  faCity,
  faCoins,
  faCreditCard,
  faFlag,
  faHouseUser,
  faLandmark,
  faMapPin,
  faMountainCity,
  faPhone,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainImage from "components/MainImage/MainImage";
import MainStepper from "components/MainStepper/MainStepper";
import { EStepStatus } from "components/MainStepper/_components/stepper.types";
import Modal from "components/Modal/Modal";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import clientServices from "services/clientServices";
import { EOrderRequestStatus } from "types/enums";
import { IOrderRequest } from "types/order-request";

export default function OrderDetailsModal({
  activeModal,
  request,
  onClose,
  refetch,
  handleCheckoutModalOpen,
  withAction = true,
}: {
  activeModal: string | boolean;
  request: IOrderRequest;
  onClose: (x: any) => void;
  refetch?: () => void;
  handleCheckoutModalOpen?: (request: {}) => void;
  withAction?: boolean;
}) {
  const { t } = useTranslation();
  const location = useLocation();

  const orderClientStatus =
    request.status === EOrderRequestStatus.CLIENT_ACCEPTED
      ? EStepStatus.COMPLETED
      : request.status === EOrderRequestStatus.CLIENT_REJECTED
      ? EStepStatus.REJECTED
      : EStepStatus.PENDING;

  const orderVendorStatus =
    request.status === EOrderRequestStatus.VENDOR_ACCEPTED ||
    orderClientStatus === EStepStatus.COMPLETED ||
    orderClientStatus === EStepStatus.REJECTED
      ? EStepStatus.COMPLETED
      : request.status === EOrderRequestStatus.VENDOR_REJECTED
      ? EStepStatus.REJECTED
      : EStepStatus.PENDING;

  // if any one responded to the request then the first step is done
  const requstStatus =
    request.status === EOrderRequestStatus.VENDOR_ACCEPTED ||
    request.status === EOrderRequestStatus.CLIENT_ACCEPTED ||
    request.status === EOrderRequestStatus.VENDOR_REJECTED ||
    request.status === EOrderRequestStatus.CLIENT_REJECTED
      ? EStepStatus.COMPLETED
      : EStepStatus.PENDING;

  const handleClientReject = (request: IOrderRequest) => {
    clientServices
      .rejectOrderRequest({ _id: request._id })
      .then(() => {
        toastPopup.success("Order cancelled");
        if (refetch) refetch();
      })
      .catch(responseErrorToast);
  };
  return (
    <Modal
      visible={
        (typeof activeModal === "string" && activeModal === request._id) ||
        (typeof activeModal === "boolean" && activeModal)
      }
      title="orderDetails"
      onClose={onClose}
      className="p-5 min-w-[70vw] overflow-y-scroll"
    >
      <h5>{t("orderStatus")}</h5>
      <MainStepper
        steps={
          location.pathname.includes("requests")
            ? [
                { label: "Request", status: requstStatus },
                { label: "vendor", status: orderVendorStatus },
                { label: "client", status: orderClientStatus },
              ]
            : [
                {
                  label: "pending",
                  status: EStepStatus.COMPLETED,
                },
                {
                  label: "in progress",
                  status:
                    request.status === "in progress" ||
                    request.status === "delivered"
                      ? EStepStatus.COMPLETED
                      : EStepStatus.PENDING,
                },
                {
                  label: "delivered",
                  status:
                    request.status === "delivered"
                      ? EStepStatus.COMPLETED
                      : EStepStatus.PENDING,
                },
              ]
        }
      />
      <hr className="mt-8" />
      <section>
        <h5 className="my-3">{t("paymentDetails")}</h5>
        <div className="max-w-lg mx-auto flex flex-row gap-3 flex-wrap w-full">
          <div className="h-24 shrink-0 w-24 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
            <FontAwesomeIcon
              icon={
                request.paymentMethod.includes("cash") ? faWallet : faCreditCard
              }
              className="p-2"
              size="2x"
            />
            <span>
              {t(
                request.paymentMethod === "cash on delivery" ? "cash" : "Visa"
              )}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h6 className="capitalize font-semibold">{t("total")}</h6>
            <p>{!!request.total && getLocalizedNumber(+request.total, true)}</p>
            <p className="line-through text-slate-700">
              {!!request.originalTotal &&
                getLocalizedNumber(+request.originalTotal, true)}
            </p>
          </div>
          <div className="ms-auto">
            <div className="h-24 w-24 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
              <span>{t("points")}</span>
              <FontAwesomeIcon icon={faCoins} className="p-2" size="2x" />
              <span>{getLocalizedNumber(request.points ?? 0)}</span>
            </div>{" "}
          </div>
        </div>
      </section>

      <hr className="mt-8" />
      <section>
        <h5 className="my-3">{t("orderDetails")}</h5>
        <div className="max-w-lg mx-auto flex flex-col divide-y divide-black/5 gap-2">
          {request.items.map((item) => (
            <div key={item.product._id} className="flex flex-row gap-3">
              <div className="h-24 w-24 relative overflow-hidden items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
                <MainImage
                  src={item.product.image?.[0].Location}
                  alt={getLocalizedWord(item.product.name)}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-1 end-1 z-10 text-red-900 font-bold bg-white/80 rounded-lg px-1">
                  x{getLocalizedNumber(item.quantity)}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h6 className="capitalize font-semibold">
                  {getLocalizedWord(item.product.name)}
                </h6>
                <p>
                  {!!item.product.price &&
                    getLocalizedNumber(+item.product.price, true)}
                </p>
                <p className="line-through text-slate-700">
                  {!!item.product.originalPrice &&
                    getLocalizedNumber(+item.product.originalPrice, true)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <hr className="mt-8" />
      <section>
        <h5 className="my-3">{t("address")}</h5>
        <div className="max-w-lg mx-auto flex flex-col divide-y divide-black/5 gap-2">
          <div className="flex flex-row gap-3">
            <div className="h-7 w-7 mb-2 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
              <FontAwesomeIcon icon={faPhone} className="text-primary" />
            </div>
            {request.contactPhone ?? "---"}
          </div>
          <div className="flex flex-row gap-3">
            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
              <FontAwesomeIcon icon={faHouseUser} className="text-primary" />
            </div>
            {request.shippingAddress?.flatNumber ?? "---"}
          </div>
          <div className="flex flex-row gap-3">
            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
              <FontAwesomeIcon icon={faBuilding} className="text-primary" />
            </div>
            {request.shippingAddress?.buildingNumber ?? "---"}
          </div>
          <div className="flex flex-row gap-3">
            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
              <FontAwesomeIcon icon={faLandmark} className="text-primary" />
            </div>
            {request.shippingAddress?.specialMark ?? "---"}
          </div>
          <div className="flex flex-row gap-3">
            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
              <FontAwesomeIcon icon={faMapPin} className="text-primary" />
            </div>
            {request.shippingAddress?.street ?? "---"}
          </div>
          <div className="flex flex-row gap-3">
            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
              <FontAwesomeIcon icon={faMountainCity} className="text-primary" />
            </div>
            {request.shippingAddress?.district ?? "---"}
          </div>
          <div className="flex flex-row gap-3">
            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
              <FontAwesomeIcon icon={faCity} className="text-primary" />
            </div>
            {request.shippingAddress?.city ?? "---"}
          </div>
          <div className="flex flex-row gap-3">
            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
              <FontAwesomeIcon icon={faFlag} className="text-primary" />
            </div>
            {request.shippingAddress?.country ?? "---"}
          </div>
        </div>
      </section>
      <hr className="mt-8" />
      {withAction && (
        <section className="max-w-lg mx-auto flex w-full flex-row gap-4 justify-center items-center py-3">
          <button
            onClick={() =>
              handleCheckoutModalOpen && handleCheckoutModalOpen(request)
            }
            disabled={
              request.status.includes("pending") ||
              request.status.includes("rejected") ||
              request.status.includes("client")
            }
            className="disabled:!opacity-20 bg-primary flex-grow rounded-lg text-white opacity-80 transition-opacity py-1 hover:opacity-100"
          >
            {t("checkout")}
          </button>
          <button
            disabled={
              request.status.includes("rejected") ||
              request.status.includes("client")
            }
            onClick={() => handleClientReject && handleClientReject(request)}
            className="disabled:!opacity-20 bg-red-500 flex-grow rounded-lg text-white opacity-80 transition-opacity py-1 hover:opacity-100"
          >
            {t("Decline")}
          </button>
        </section>
      )}
    </Modal>
  );
}
