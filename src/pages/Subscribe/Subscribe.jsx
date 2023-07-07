import classNames from "classnames";
import { MainButton } from "components/Buttons";
import CardContainer from "components/CardContainer/CardContainer";
import { ImageEdit } from "components/Inputs";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import Modal from "components/Modal/Modal";
import STOP_UGLY_CACHEING from "constants/configSWR";
import dayjs from "dayjs";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import clientServices from "services/clientServices";
import paymobServices from "services/paymob.services";
import useSWR from "swr";

const initialPaymentModal = { open: false, url: "" };

const fetchWallet = () => clientServices.getSetting("walletNumber");
const fetchInfo = () => clientServices.updateInfo().then((res) => res.record);
function Subscribe(props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const [uploadImage, setUploadImage] = useState(null);
  const [paymentModal, setPaymentModal] = useState(initialPaymentModal);
  const [loading, setLoading] = useState(false);

  const { data: account, isLoading } = useSWR(
    "account-details",
    fetchInfo,
    STOP_UGLY_CACHEING
  );
  const { data: walletnumberData } = useSWR(
    "account-wallet",
    fetchWallet,
    STOP_UGLY_CACHEING
  );

  const subscriptionHandler = () => {
    const formData = new FormData();
    formData.append("image", uploadImage);
    formData.append("walletNumber", walletnumberData?.record);

    clientServices
      .subscribeUser()
      .then(({ data }) => {
        toastPopup.success("Subscription request sent!");
        navigate(0);
      })
      .catch(({ response }) => toastPopup.error(response.data.error));
  };

  async function handleOrderRequestProceed() {
    setLoading(true);
    localStorage.setItem("isPremiumSubscribtionRequest", true);
    const url = await paymobServices.paymobProcessURL(50);
    setPaymentModal({ open: true, url });
    setLoading(false);
  }

  const renderData = () => {
    if (isLoading) return <LoadingSpinner />;
    else
      return (
        <section className="flex flex-col gap-6 justify-center items-center min-w-fit sm:max-w-[60%] mx-auto">
          <header className="w-full text-center">
            <h3>{getLocalizedWord(account?.name)}</h3>
          </header>
          <div className="flex flex-col gap-6 p-8 text-xl w-full ring ring-primary/20 rounded-lg">
            <div className="flex flex-row gap-4 justify-between">
              <p className="font-semibold">{t("subscription")}</p>
              <p>
                {t(account?.isSubscribed ? "Subscribed" : "Not subscribed")}
              </p>
            </div>
            {!!account.subStartDate && (
              <div className="flex flex-row gap-4 justify-between">
                <p className="font-semibold">{t("startDate")}</p>
                <p>
                  {dayjs(account?.subStartDate)
                    .locale(lang)
                    .format("DD/MM/YYYY")}
                </p>
              </div>
            )}
            {!!account.subEndDate && (
              <div className="flex flex-row gap-4 justify-between">
                <p className="font-semibold">{t("endDate")}</p>
                <p>
                  {dayjs(account?.subEndDate).locale(lang).format("DD/MM/YYYY")}
                </p>{" "}
              </div>
            )}
            <div className="flex flex-row gap-4 justify-between">
              <p className="font-semibold capitalize">{t("free trial")}</p>
              <p>{t(account?.usedFreeTrial ? "Used" : "didnotUseFreeTrial")}</p>
            </div>
          </div>

          <div
            className={classNames(
              {
                "!hidden": account?.isSubscribed,
              },
              "ring p-4 rounded-lg ring-primary/30 flex flex-col w-full gap-3"
            )}
          >
            <h5 className="max-sm:!text-lg font-black uppercase rounded-lg bg-primary text-white mx-auto w-fit p-2">
              {t("1 Year subscription")}
            </h5>
            <h6 className="font-black uppercase rounded-lg text-primary mx-auto w-fit p-2 text-2xl">
              {getLocalizedNumber(50, true)}
            </h6>
            <figure className="w-full mb-3 flex flex-col">
              <ImageEdit
                setImgUpdated={setUploadImage}
                setUploadImage={setUploadImage}
                uploadImage={uploadImage}
                style={{
                  overflow: "hidden",
                  width: "100%",
                  height: "300px",
                }}
              />
              <caption className="italic text-black/50">
                {t("upload the receipt")}
              </caption>
            </figure>
            <p className="italic font-semibold text-slate-700 mx-auto max-w-[80%] text-center">
              {t("Subscription fess will be sent to the wallet number")} :{" "}
              <pre className="text-slate-900 inline">
                {walletnumberData?.record ?? "not valid wallet number"}
              </pre>
            </p>
            <div className={classNames("flex flex-row gap-3 justify-between")}>
              <MainButton
                loading={loading}
                size="medium"
                onClick={subscriptionHandler}
                disabled={account?.isSubscribed}
                className="w-60 mx-auto whitespace-nowrap !text-lg"
                text={account?.isSubscribed ? "Subscribed" : "with wallet"}
              />
              <MainButton
                loading={loading}
                size="medium"
                onClick={handleOrderRequestProceed}
                disabled={account?.isSubscribed}
                className="w-60 mx-auto whitespace-nowrap !text-lg"
                text={account?.isSubscribed ? "Subscribed" : "online"}
              />
            </div>
          </div>
          <Modal
            className="w-screen h-screen"
            visible={paymentModal.open}
            onClose={() => setPaymentModal({ open: false, url: "" })}
          >
            {paymentModal.url && (
              <iframe
                title="payment"
                src={paymentModal.url}
                width="100%"
                height="100%"
                frameBorder="0"
              ></iframe>
            )}
          </Modal>
        </section>
      );
  };
  return <CardContainer title="subscription">{renderData()}</CardContainer>;
}

Subscribe.propTypes = {};

export default Subscribe;
