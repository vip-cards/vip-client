import { ServiceCard } from "components/Cards";
import {
  PageQueryWrapper,
  SearchBar,
  SearchProvider,
} from "components/PageQueryContainer/PageQueryContext";
import Tabs from "components/Tabs/Tabs";
import { listRenderFn } from "helpers/renderFn";
import { useEffect, useLayoutEffect, useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";
import CreateServiceForm from "./CreateServiceForm";
import "./Services.scss";
import classNames from "classnames";
import { getLocalizedWord } from "helpers/lang";
import { t } from "i18next";
import STOP_UGLY_CACHEING from "constants/configSWR";
import CardContainer from "components/CardContainer/CardContainer";

const LIMIT = 9;

const initialFilters = { "category._id": null };

function ServiceHome({ id = undefined }) {
  const initialQueryParams = id
    ? {
        page: 1,
        limit: LIMIT,
        provider: id,
      }
    : {
        page: 1,
        limit: LIMIT,
        // client: id,
      };

  const [queryParams, setQueryParams] = useState(initialQueryParams);
  const [filter, setFilter] = useState(initialFilters);

  const { data: servicesData, isLoading } = useSWR(
    [`view-all-services`, queryParams],
    ([, queryParams]) => {
      console.log(
        "----------------request hitted---------------------------",
        queryParams
      );

      return clientServices.listAllServices(queryParams);
    },
    STOP_UGLY_CACHEING
  );
  const { data: categories } = useSWR(
    "services-categories",
    () =>
      clientServices
        .listAllCategories({ type: "service" })
        .then((data) => data.records),
    STOP_UGLY_CACHEING
  );
  const { records: services = undefined, counts = 0 } = servicesData ?? {};

  const renderObj = {
    isLoading,
    list: services,
    render: (service: IService) => <ServiceCard service={service} />,
  };

  console.log("----------------services---------------------------", services);

  useEffect(() => {
    console.log("----------------useEffect---------------------------", id);
    setFilter(initialFilters);
    if (id) setQueryParams((q) => ({ ...q, provider: id }));
    else setQueryParams(initialQueryParams);
  }, [id]);

  return (
    <SearchProvider
      limit={LIMIT}
      itemsCount={counts}
      filter={filter}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
      listRenderFn={() => listRenderFn(renderObj)}
    >
      <div className="transition-all border-t-primary border-t-2">
        <SearchBar
          withSelector={true}
          types={["serviceName", "providerName"]}
        />
      </div>
      <div className="flex flex-col h-full flex-grow mt-8">
        <aside className="flex flex-row flex-wrap gap-x-3 gap-y-2 justify-start items-start mb-2">
          <button
            onClick={() => {
              setFilter((f) => ({
                ...f,
                "category._id": null,
              }));
              setQueryParams((prev) => {
                return { ...prev, ...initialQueryParams };
              });
            }}
            className={classNames("px-3 py-1 rounded-lg border text-sm", {
              "bg-primary/50 shadow-lg text-slate-800": !filter["category._id"],
              "bg-primary shadow text-black": filter["category._id"],
            })}
          >
            <>{t("reset")}</>
          </button>
          {categories?.map((category) => (
            <button
              onClick={() => {
                setFilter((f) => ({
                  ...f,
                  "category._id":
                    filter["category._id"] === category._id
                      ? null
                      : category._id,
                }));
                setQueryParams((prev) => {
                  return { ...prev, ...initialQueryParams };
                });
              }}
              key={category._id}
              className={classNames("px-3 py-1 rounded-lg border text-sm", {
                "bg-primary": filter["category._id"] === category._id,
                "bg-transparent group-hover:bg-primary/50":
                  filter["category._id"] !== category._id,
              })}
            >
              {getLocalizedWord(category.name)}
            </button>
          ))}
        </aside>{" "}
        <div className="flex flex-row gap-4 items-center justify-center flex-wrap my-8">
          <PageQueryWrapper />
        </div>
      </div>
    </SearchProvider>
  );
}

export default function Services() {
  let userId = localStorage.getItem("userId");
  const tabs = {
    home: {
      label: "Home",
      panel: <ServiceHome />,
      role: "auth",
    },

    createJob: {
      label: "createService",
      panel: <CreateServiceForm />,
      role: "subscribed",
    },

    viewCreatedJob: {
      label: "viewCreatedServices",
      panel: <ServiceHome id={userId} />,
      role: "subscribed",
    },
  };

  return (
    <CardContainer className="" title="" withHeader={false}>
      <Tabs tabs={tabs} />
    </CardContainer>
  );
}
