import { faInfoCircle, faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import OrderDetailsModal from "components/Modals/OrderDetailsModal";
import dayjs from "dayjs";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import clientServices from "services/clientServices";
import { IOrderRequest } from "types/order-request";

interface IOrderRequestsTableProps {
  requests: IOrderRequest[];
  handleCheckoutModalOpen: (request: {}) => void;
  refetch: () => void;
}

function OrderRequestsTable({
  requests,
  handleCheckoutModalOpen,
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
                          onClick={() => handleCheckoutModalOpen(request)}
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
                    <OrderDetailsModal
                      onClose={() => setActiveModal("")}
                      activeModal={activeModal}
                      request={request}
                      refetch={refetch}
                      handleCheckoutModalOpen={handleCheckoutModalOpen}
                    />
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
