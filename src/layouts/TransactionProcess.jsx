import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toastPopup from "helpers/toastPopup";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import clientServices from "services/clientServices";
import { newOrderRequest } from "services/socket/order";

const TransactionProcess = () => {
  const [params] = useSearchParams();

  useEffect(() => {
    if (params.get("success")) {
      clientServices
        .checkoutRequest(params.get("merchant_order_id"))
        .then(() => {
          toastPopup.success("The order is sucessfully ordered!");
          newOrderRequest(params.get("merchant_order_id"));
        });
    }
  }, [params]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-8">
      {params && (
        <>
          <h1>{params.get("txn_response_code")}</h1>
          <div>
            <FontAwesomeIcon
              icon={params.get("success") ? faCheckCircle : faExclamationCircle}
              size="10x"
              className="text-secondary"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionProcess;
