import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toastPopup from "helpers/toastPopup";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import clientServices from "services/clientServices";
import { EVENTS, socket } from "services/socket/config";
import { selectAuth } from "store/auth-slice";

const TransactionProcess = () => {
  const auth = useSelector(selectAuth);
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("success")) {
      const requestId = params.get("merchant_order_id");
      clientServices
        .checkoutRequest(requestId)
        .then(() => clientServices.acceptOrder(requestId))
        .then(() => {
          socket.emit(EVENTS.ORDER.FETCH_ORDER_ROOM, {
            client: auth.userId,
            requestId,
            status: "client accepted",
          });
          toastPopup.success("Done!");
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
              icon={
                !!params.get("success") ? faCheckCircle : faExclamationCircle
              }
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
