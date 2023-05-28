import { faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import dayjs from "dayjs";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import { useTranslation } from "react-i18next";
import clientServices from "services/clientServices";

function OrderRequestsTable({ requests, handleOrderRequestProceed, refetch }) {
  const { t } = useTranslation();

  const handleClientReject = () => {
    clientServices
      .rejectOrderRequest()
      .then(() => {
        toastPopup.success("Order cancelled");
        refetch();
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          toastPopup.error(error.response.data.error);
        } else {
          toastPopup.error(error.message);
        }
      });
  };

  return (
    <div className="flex flex-col shadow-lg rounded-lg">
      <h1 className="title">{t("previousOrdersStatus")}</h1>

      <div className="overflow-hidden overflow-x-auto p-8 x-12 ">
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
                        disabled={
                          request.status.includes("pending") ||
                          request.status.includes("rejected")
                        }
                        className="disabled:!opacity-20 bg-primary rounded-lg text-white opacity-80 transition-opacity py-1 hover:opacity-100"
                      >
                        Proceed to checkout
                      </button>
                      <button
                        disabled={request.status.includes("rejected")}
                        onClick={handleClientReject}
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
    </div>
  );
}
export default OrderRequestsTable;
