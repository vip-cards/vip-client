import CardContainer from "components/CardContainer/CardContainer";
import { Adcard } from "components/Cards";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";
import clientServices from "services/clientServices";
import useSWR from "swr";
import "./PreviousAds.scss";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { t } from "i18next";
import STOP_UGLY_CACHEING from "constants/configSWR";

const adsFetcher = ([key, params]) => clientServices.listAllAds({ ...params });

const PreviousAds = () => {
  const auth = useSelector((state) => state.auth.userData);
  const [filter, setFilter] = useState({ types: [], statuses: [] });
  const initialQuerParams = { client: auth._id };
  const [queryParams, setQueryParams] = useState(initialQuerParams);
  const {
    data: adsData,
    error,
    isLoading,
    mutate,
  } = useSWR(
    ["list-previous-ads", queryParams],
    adsFetcher,
    STOP_UGLY_CACHEING
  );

  const { records: adsList = undefined } = adsData ?? {};

  const allTypes = ["banner", "popup", "notification"];

  const allStatuses = ["pending", "accepted", "rejected"];

  const toggleFilter = (arrayKey = "types", itemId) => {
    const newVendorFilterList = [...filter[arrayKey]];
    const idx = filter[arrayKey].findIndex((value) => value === itemId);
    if (idx > -1) {
      newVendorFilterList.splice(idx, 1);
    } else {
      newVendorFilterList.push(itemId);
    }

    setFilter((filters) => ({ ...filters, [arrayKey]: newVendorFilterList }));
  };

  useEffect(() => {
    setQueryParams((q) => {
      const type = filter.types?.length ? { type: filter.types } : null;

      if (!type && "type" in q) delete q.type;

      const status = filter.statuses?.length
        ? { status: filter.statuses }
        : null;

      if (!status && "status" in q) delete q.status;

      return {
        ...q,
        ...type,
        ...status,
      };
    });
  }, [filter]);

  const render = () => {
    if (isLoading) return <LoadingSpinner />;
    else if (error) return <div>Something went wrong</div>;
    else if (adsList?.length)
      return adsList?.map((ad) => (
        <Adcard key={ad._id} ad={ad} mutate={mutate} />
      ));
    else return <NoData />;
  };

  return (
    <CardContainer className="previous-ads-page" title={"Previous_Ads"}>
      <aside className="flex flex-row flex-wrap gap-x-3 gap-y-2 justify-start items-start mt-5 mb-2">
        <button
          onClick={() => {
            setFilter((f) => ({ ...f, types: [] }));
          }}
          className={classNames("px-3 py-1 rounded-lg border text-sm", {
            "bg-primary/50 shadow-lg text-slate-800": !filter.types?.length,
            "bg-primary shadow text-black": filter.types?.length,
          })}
        >
          {t("reset")}
        </button>
        {allTypes.map((type) => (
          <button
            onClick={() => {
              toggleFilter("types", type);
            }}
            key={type}
            className={classNames(
              "px-3 py-1 rounded-lg border text-sm capitalize",
              {
                "bg-primary":
                  filter.types?.findIndex((item) => item === type) > -1,
                "bg-transparent group-hover:bg-primary/50": !(
                  filter.types?.findIndex((item) => item === type) > -1
                ),
              }
            )}
          >
            {t(type)}
          </button>
        ))}
      </aside>

      <aside className="flex flex-row flex-wrap gap-x-3 gap-y-2 justify-start items-start mt-5 mb-2">
        <button
          onClick={() => {
            setFilter((f) => ({ ...f, statuses: [] }));
          }}
          className={classNames("px-3 py-1 rounded-lg border text-sm", {
            "bg-primary/50 shadow-lg text-slate-800": !filter.statuses?.length,
            "bg-primary shadow text-black": filter.statuses?.length,
          })}
        >
          {t("reset")}
        </button>
        {allStatuses.map((status) => (
          <button
            onClick={() => {
              toggleFilter("statuses", status);
            }}
            key={status}
            className={classNames(
              "px-3 py-1 rounded-lg border text-sm capitalize",
              {
                "bg-primary":
                  filter.statuses?.findIndex((item) => item === status) > -1,
                "bg-transparent group-hover:bg-primary/50": !(
                  filter.statuses?.findIndex((item) => item === status) > -1
                ),
              }
            )}
          >
            {t(status)}
          </button>
        ))}
      </aside>

      <div className="flex flex-row gap-6 flex-wrap w-full justify-center items-center p-4">
        {render()}
      </div>
    </CardContainer>
  );
};

export default PreviousAds;
