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

  const [params, setParams] = useSearchParams();

  const hasFreeTrial = !auth?.userData?.usedFreeTrial;

  async function proceedFn(params) {
    if (!params.get("success")) return;
    const isSuccess = params.get("success") === "true";

    if (isSuccess) {
      const requestId = params.get("merchant_order_id");
      try {
        if (hasFreeTrial) {
          await clientServices.checkoutFreeTrial(requestId);
        } else {
          await clientServices.checkoutRequest(requestId);
        }

        await clientServices.acceptOrder(requestId);

        socket.emit(EVENTS.ORDER.FETCH_ORDER_ROOM, {
          client: auth.userId,
          requestId,
          status: "client accepted",
        });

        toastPopup.success("Done!");
      } catch (error) {
        toastPopup.error("Something went wrong!");
      }
    } else toastPopup.error("Something went wrong!");
  }

  useEffect(() => {
    proceedFn(params);
  }, [params]);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-8">
      {params && (
        <>
          <h1>{params.get("txn_response_code")}</h1>
          <div>
            <FontAwesomeIcon
              icon={
                params.get("success") === "true"
                  ? faCheckCircle
                  : faExclamationCircle
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

function printSuccess() {
  BroadcastChannel.postMessage("Success!");
}
export default TransactionProcess;
