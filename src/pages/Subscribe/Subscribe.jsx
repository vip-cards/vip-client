import { MainButton } from "components/Buttons";
import CardContainer from "components/CardContainer/CardContainer";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import clientServices from "services/clientServices";
import useSWR from "swr";

function Subscribe(props) {
  const {
    data: accountData,
    isLoading,
    isValidating,
    error,
    mutate,
  } = useSWR("setting-wallet", () => clientServices.updateInfo());
  const { data: walletnumberData } = useSWR("account-details", () =>
    clientServices.getSetting("walletNumber")
  );

  const account = accountData?.record;

  const subscriptionHandler = () => {
    clientServices.subscribeUser().then(({ data }) => console.log(data));
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
            <div className="flex flex-row gap-4 justify-between">
              <p className="font-semibold">Start Date</p>
              <p>{dayjs(account?.subStartDate).format("DD-MM-YYYY")}</p>
            </div>
            <div className="flex flex-row gap-4 justify-between">
              <p className="font-semibold">End Date</p>
              <p>{dayjs(account?.subEndDate).format("DD-MM-YYYY")}</p>{" "}
            </div>
            <div className="flex flex-row gap-4 justify-between">
              <p className="font-semibold">Free trial usage</p>
              <p>{account?.usedFreeTrial ? "Used" : "Not used"}</p>
            </div>
          </div>
          <div className="ring p-4 rounded-lg ring-primary/30 w-full flex flex-row justify-between items-center">
            <p className="text-xl">50 EGP / 1 year</p>
            <MainButton
              size="medium"
              onClick={subscriptionHandler}
              disabled={account?.isSubscribed}
            >
              Subsribe
            </MainButton>
          </div>
          <p className="italic font-semibold text-slate-700">
            Subscription fess will be sent to the wallet number :{" "}
            {walletnumberData?.record ?? "not valid wallet number"}
          </p>
        </section>
      );
  };
  return <CardContainer title="subscription">{renderData()}</CardContainer>;
}

Subscribe.propTypes = {};

export default Subscribe;
