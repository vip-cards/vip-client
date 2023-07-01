import {
  faBuilding,
  faCity,
  faCoins,
  faCreditCard,
  faFlag,
  faHouseUser,
  faInfoCircle,
  faLandmark,
  faMap,
  faMapPin,
  faMountainCity,
  faPhone,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainImage } from "components";
import MainStepper from "components/MainStepper/MainStepper";
import { EStepStatus } from "components/MainStepper/_components/stepper.types";
import Modal from "components/Modal/Modal";
import dayjs from "dayjs";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import clientServices from "services/clientServices";
import { EOrderRequestStatus } from "types/enums";

interface IOrderRequestsTableProps {
  requests: IOrderRequest[];
  handleOrderRequestProceed: (requestId: string, total: number) => void;
  refetch: () => void;
}

function OrderRequestsTable({
  requests,
  handleOrderRequestProceed,
  refetch,
}: IOrderRequestsTableProps) {
  const { t, i18n } = useTranslation();
  const [activeModal, setActiveModal] = useState<string>("");

  const lang = i18n.language;

  const handleClientReject = (request: IOrderRequest) => {
    clientServices
      .rejectOrderRequest({ _id: request._id })
      .then(() => {
        toastPopup.success("Order cancelled");
        refetch();
      })
      .catch(responseErrorToast);
  };

  return (
    <div className="flex flex-col shadow-lg rounded-lg">
      <div className="overflow-hidden overflow-x-auto p-8 x-12 ">
        <table className="table-fixed w-full min-w-[60rem]">
          <thead>
            <tr className="divide-slate-900/30 divide-x">
              <th className="text-start capitalize pb-2 px-2">{t("branch")}</th>
              <th className="text-start capitalize w-60 pb-2 px-2">
                {t("Products")}
              </th>
              <th className="text-start capitalize w-30 pb-2 px-2">
                {t("Shipping fees")}
              </th>
              <th className="text-start capitalize w-30 pb-2 px-2">
                {t("total")}
              </th>
              <th className="text-start capitalize w-36 pb-2 px-2">
                {t("Status")}
              </th>
              <th className="text-end pb-2 px-2">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody className="border-t border-t-black [&_*]:capitalize">
            {requests
              // ?.sort((a, b) => (a.status === "pending" ? 0 : -1))
              .map((request) => {
                const orderClientStatus =
                  request.status === EOrderRequestStatus.CLIENT_ACCEPTED
                    ? EStepStatus.COMPLETED
                    : request.status === EOrderRequestStatus.CLIENT_REJECTED
                    ? EStepStatus.REJECTED
                    : EStepStatus.PENDING;

                const orderVendorStatus =
                  request.status === EOrderRequestStatus.VENDOR_ACCEPTED ||
                  orderClientStatus === EStepStatus.COMPLETED
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

                return (
                  <Fragment key={request._id}>
                    <tr>
                      <td colSpan={6} className="pt-3 font-semibold">
                        {dayjs(request.requestDate)
                          .locale(lang)
                          .format("DD/MM/YYYY hh:mm A")}
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="text-primary ms-2 cursor-pointer hover:text-primary/80 transition-colors active:text-primary/60"
                          onClick={() => setActiveModal(request._id)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6} className="pt-3 font-medium space-x-4">
                        <FontAwesomeIcon
                          icon={faMap}
                          className="text-primary"
                        />
                        <span>
                          {request.shippingAddress?.flatNumber ?? "---"},{" "}
                          {request.shippingAddress?.buildingNumber ?? "---"},{" "}
                          {request.shippingAddress?.street ?? "---"},{" "}
                          {request.shippingAddress?.district ?? "---"},{" "}
                          {request.shippingAddress?.city ?? "---"} ,
                          {request.shippingAddress?.country ?? "---"} ...
                          {request.shippingAddress?.specialMark ?? "---"}
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
                          getLocalizedNumber(
                            request.shippingFees ?? 0,
                            true
                          )) ||
                          "---"}
                      </td>
                      <td>{getLocalizedNumber(+request.total, true)}</td>
                      <td>
                        <span
                          className={classNames(
                            "text-sm rounded-md py-1 px-2",
                            {
                              "bg-green-600/10 ring-green-600/80 ring-2":
                                request.status.includes("accepted"),
                              "bg-red-500/10 ring-red-500/80 ring-2":
                                request.status.includes("rejected"),
                              "bg-yellow-500/10 ring-yellow-500/80 ring-2":
                                request.status.includes("pending"),
                            }
                          )}
                        >
                          {t(request.status)}
                        </span>
                      </td>

                      <td className="flex flex-col gap-4 justify-center py-3">
                        <button
                          onClick={() =>
                            handleOrderRequestProceed(
                              request._id,
                              +request.total
                            )
                          }
                          disabled={
                            request.status.includes("pending") ||
                            request.status.includes("rejected") ||
                            request.status.includes("client")
                          }
                          className="disabled:!opacity-20 bg-primary rounded-lg text-white opacity-80 transition-opacity py-1 hover:opacity-100"
                        >
                          {t("checkout")}
                        </button>
                        <button
                          disabled={
                            request.status.includes("rejected") ||
                            request.status.includes("client")
                          }
                          onClick={() => handleClientReject(request)}
                          className="disabled:!opacity-20 bg-red-500 rounded-lg text-white opacity-80 transition-opacity py-1 hover:opacity-100"
                        >
                          {t("Decline")}
                        </button>
                      </td>
                    </tr>
                    <Modal
                      visible={activeModal === request._id}
                      title="order requeset details"
                      onClose={() => setActiveModal("")}
                      className="p-5 min-w-[70vw] overflow-y-scroll"
                    >
                      <h5>{t("orderStatus")}</h5>
                      <MainStepper
                        steps={[
                          { label: "Request", status: requstStatus },
                          { label: "vendor", status: orderVendorStatus },
                          { label: "client", status: orderClientStatus },
                        ]}
                      />
                      <hr className="mt-8" />
                      <section className="">
                        <h5 className="my-3">{t("paymentDetails")}</h5>
                        <div className="max-w-lg mx-auto flex flex-row gap-3 flex-wrap w-full">
                          <div className="h-24 shrink-0 w-24 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
                            <FontAwesomeIcon
                              icon={
                                request.paymentMethod === "cash on delivery"
                                  ? faWallet
                                  : faCreditCard
                              }
                              className="p-2"
                              size="2x"
                            />
                            <span>
                              {t(
                                request.paymentMethod === "cash on delivery"
                                  ? "cash"
                                  : "Visa"
                              )}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <h6 className="capitalize font-semibold">
                              {t("total")}
                            </h6>
                            <p>
                              {!!request.total &&
                                getLocalizedNumber(+request.total, true)}
                            </p>
                            <p className="line-through text-slate-700">
                              {!!request.originalTotal &&
                                getLocalizedNumber(
                                  +request.originalTotal,
                                  true
                                )}
                            </p>
                          </div>
                          <div className="ms-auto">
                            <div className="h-24 w-24 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
                              <FontAwesomeIcon
                                icon={faCoins}
                                className="p-2"
                                size="2x"
                              />
                              <span>
                                {getLocalizedNumber(request.points ?? 0)}
                              </span>
                            </div>{" "}
                          </div>
                        </div>
                      </section>

                      <hr className="mt-8" />
                      <section>
                        <h5 className="my-3">{t("orderDetails")}</h5>
                        <div className="max-w-lg mx-auto flex flex-col divide-y divide-black/5 gap-2">
                          {request.items.map((item) => (
                            <div
                              key={item.product._id}
                              className="flex flex-row gap-3"
                            >
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
                                    getLocalizedNumber(
                                      +item.product.price,
                                      true
                                    )}
                                </p>
                                <p className="line-through text-slate-700">
                                  {!!item.product.originalPrice &&
                                    getLocalizedNumber(
                                      +item.product.originalPrice,
                                      true
                                    )}
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
                              <FontAwesomeIcon
                                icon={faPhone}
                                className="text-primary"
                              />
                            </div>
                            {request.contactPhone ?? "---"}
                          </div>
                          <div className="flex flex-row gap-3">
                            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
                              <FontAwesomeIcon
                                icon={faHouseUser}
                                className="text-primary"
                              />
                            </div>
                            {request.shippingAddress?.flatNumber ?? "---"}
                          </div>
                          <div className="flex flex-row gap-3">
                            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
                              <FontAwesomeIcon
                                icon={faBuilding}
                                className="text-primary"
                              />
                            </div>
                            {request.shippingAddress?.buildingNumber ?? "---"}
                          </div>
                          <div className="flex flex-row gap-3">
                            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
                              <FontAwesomeIcon
                                icon={faLandmark}
                                className="text-primary"
                              />
                            </div>
                            {request.shippingAddress?.specialMark ?? "---"}
                          </div>
                          <div className="flex flex-row gap-3">
                            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
                              <FontAwesomeIcon
                                icon={faMapPin}
                                className="text-primary"
                              />
                            </div>
                            {request.shippingAddress?.street ?? "---"}
                          </div>
                          <div className="flex flex-row gap-3">
                            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
                              <FontAwesomeIcon
                                icon={faMountainCity}
                                className="text-primary"
                              />
                            </div>
                            {request.shippingAddress?.district ?? "---"}
                          </div>
                          <div className="flex flex-row gap-3">
                            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
                              <FontAwesomeIcon
                                icon={faCity}
                                className="text-primary"
                              />
                            </div>
                            {request.shippingAddress?.city ?? "---"}
                          </div>
                          <div className="flex flex-row gap-3">
                            <div className="h-7 w-7 items-center flex-col flex justify-center border-primary rounded-lg border text-primary">
                              <FontAwesomeIcon
                                icon={faFlag}
                                className="text-primary"
                              />
                            </div>
                            {request.shippingAddress?.country ?? "---"}
                          </div>
                        </div>
                      </section>
                      <hr className="mt-8" />

                      <section className="max-w-lg mx-auto flex w-full flex-row gap-4 justify-center items-center py-3">
                        <button
                          onClick={() =>
                            handleOrderRequestProceed(
                              request._id,
                              +request.total
                            )
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
                          onClick={() => handleClientReject(request)}
                          className="disabled:!opacity-20 bg-red-500 flex-grow rounded-lg text-white opacity-80 transition-opacity py-1 hover:opacity-100"
                        >
                          {t("Decline")}
                        </button>
                      </section>
                    </Modal>
                  </Fragment>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default OrderRequestsTable;
