import CardContainer from "components/CardContainer/CardContainer";
import { Adcard } from "components/Cards";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import clientServices from "services/clientServices";
import useSWR from "swr";
import "./PreviousAds.scss";

const PreviousAds = () => {
  const {
    data: adsData,
    error,
    isLoading,
  } = useSWR("list-ads", () => clientServices.listAllAds());

  const { records: adsList = undefined } = adsData ?? {};

  const render = () => {
    if (isLoading) return <LoadingSpinner />;
    else if (error) return <div>Something went wrong</div>;
    else if (adsList.length)
      return adsList?.map((ad) => <Adcard key={ad._id} ad={ad} />);
    else return <NoData />;
  };

  return (
    <CardContainer className="previous-ads-page" title={"Previous_Ads"}>
      <div className="flex flex-row gap-6 flex-wrap w-full justify-center items-center p-4">
        {render()}
      </div>
    </CardContainer>
  );
};

export default PreviousAds;
