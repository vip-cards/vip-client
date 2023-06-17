import { faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import dayjs from "dayjs";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { useTranslation } from "react-i18next";
import clientServices from "services/clientServices";

function OrderRequestsTable({ requests, handleOrderRequestProceed, refetch }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const handleClientReject = (request) => {
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
              ?.sort((a, b) => (a.status === "pending" ? 0 : -1))
              .map((request) => (
                <>
                  <tr>
                    <td colSpan={6} className="pt-3 font-semibold">
                      {dayjs(request.requestDate)
                        .locale(lang)
                        .format("DD/MM/YYYY hh:mm A")}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="pt-3 font-medium space-x-4">
                      <FontAwesomeIcon icon={faMap} className="text-primary" />
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
                        {t(request.status)}
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
                </>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default OrderRequestsTable;
