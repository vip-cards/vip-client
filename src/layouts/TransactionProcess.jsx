import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import clientServices from "services/clientServices";
import { EVENTS, socket } from "services/socket/config";
import { selectAuth } from "store/auth-slice";

// those functions related to the existance of Print object which should be existed on flutter env
function printSuccess() {
  if (window.Print) window.Print.postMessage("Success!");
}
function printError() {
  if (window.Print) window.Print.postMessage("Error!");
}

const TransactionProcess = () => {
  const auth = useSelector(selectAuth);
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();

  const hasFreeTrial = !auth?.userData?.usedFreeTrial;

  async function proceedFn(params) {
    if (!params.get("success")) return;
    const isSuccess = params.get("success") === "true";

    if (isSuccess) {
      const requestId = params.get("merchant_order_id");
      const paymentEndPoint = localStorage.getItem("paymentEndPointSelect");
      const isPremiumSubscribtion = localStorage.getItem(
        "isPremiumSubscribtionRequest"
      );

      // ("useFreeTrial");
      // ("checkout");
      try {
        if (isPremiumSubscribtion) {
          await clientServices.updateInfo({
            isSubscribed: "true",
            subStartDate: dayjs().toISOString(),
            subEndDate: dayjs().add(1, "year").toISOString(),
          });
        } else {
          if (paymentEndPoint === "useFreeTrial") {
            await clientServices.checkoutFreeTrial(requestId);
          } else {
            await clientServices.checkoutRequest(requestId);
          }

          await clientServices.acceptOrder(requestId);

          localStorage.removeItem("paymentEndPointSelect");
          localStorage.removeItem("isPremiumSubscribtionRequest");

          socket.emit(EVENTS.ORDER.FETCH_ORDER_ROOM, {
            client: auth.userId,
            requestId,
            status: "client accepted",
          });
        }
        toastPopup.success("Done!");
        printSuccess();

        navigate("/", { replace: true });
      } catch (error) {
        responseErrorToast(error);
        printError();
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

export default TransactionProcess;
