import { MainButton } from "components/Buttons";
import CardContainer from "components/CardContainer/CardContainer";
import { ImageEdit } from "components/Inputs";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import { useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";

function Subscribe(props) {
  const [uploadImage, setUploadImage] = useState(null);
  const {
    data: accountData,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useSWR("account-details", () => clientServices.updateInfo());
  const { data: walletnumberData } = useSWR("account-wallet", () =>
    clientServices.getSetting("walletNumber")
  );

  const account = accountData?.record;

  const subscriptionHandler = () => {
    const formData = new FormData();
    formData.append("image", uploadImage);
    formData.append("walletNumber", walletnumberData?.record);

    clientServices
      .subscribeUser()
      .then(({ data }) => toastPopup.success("Subscription request sent!"))
      .catch(({ response }) => toastPopup.error(response.data.error));
  };

  const renderData = () => {
    if (isLoading) return <LoadingSpinner />;
    else
      return (
        <section className="flex flex-col gap-6 justify-center items-center min-w-fit max-w-[60%] mx-auto">
          <header className="w-full text-center">
            <h3>{getLocalizedWord(account?.name)}</h3>
          </header>
          <div className="flex flex-col gap-6 p-8 text-xl w-full ring ring-primary/20 rounded-lg">
            <div className="flex flex-row gap-4 justify-between">
              <p className="font-semibold">Subscribe</p>
              <p>{account?.isSubscribed ? "Subscribed" : "Not subscribed"}</p>
            </div>
            {!!account.subStartDate && (
              <div className="flex flex-row gap-4 justify-between">
                <p className="font-semibold">Start Date</p>
                <p>{dayjs(account?.subStartDate).format("DD-MM-YYYY")}</p>
              </div>
            )}
            {!!account.subEndDate && (
              <div className="flex flex-row gap-4 justify-between">
                <p className="font-semibold">End Date</p>
                <p>{dayjs(account?.subEndDate).format("DD-MM-YYYY")}</p>{" "}
              </div>
            )}
            <div className="flex flex-row gap-4 justify-between">
              <p className="font-semibold">Free trial usage</p>
              <p>{account?.usedFreeTrial ? "Used" : "Not used"}</p>
            </div>
          </div>

          <div className="ring p-4 rounded-lg ring-primary/30 flex flex-col w-full gap-3">
            <h5 className="font-black uppercase rounded-lg bg-primary text-white mx-auto w-fit p-2">
              1 Year subscription
            </h5>
            <h6 className="font-black uppercase rounded-lg text-primary mx-auto w-fit p-2 text-2xl">
              50 EGP
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
                upload the screenshot
              </caption>
            </figure>
            <p className="italic font-semibold text-slate-700 mx-auto max-w-[80%] text-center">
              Subscription fess will be sent to the wallet number :{" "}
              <span className="text-slate-900">
                {walletnumberData?.record ?? "not valid wallet number"}
              </span>
            </p>

            <MainButton
              size="medium"
              onClick={subscriptionHandler}
              disabled={account?.isSubscribed}
              className="w-60 mx-auto whitespace-nowrap !text-lg"
            >
              {account?.isSubscribed ? "Already subscribed!" : "Subsribe"}
            </MainButton>
          </div>
        </section>
      );
  };
  return <CardContainer title="subscription">{renderData()}</CardContainer>;
}

Subscribe.propTypes = {};

export default Subscribe;
