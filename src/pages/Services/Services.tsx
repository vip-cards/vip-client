import { ServiceCard } from "components/Cards";
import {
  PageQueryWrapper,
  SearchBar,
  SearchProvider,
} from "components/PageQueryContainer/PageQueryContext";
import Tabs from "components/Tabs/Tabs";
import { listRenderFn } from "helpers/renderFn";
import { useLayoutEffect, useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";
import CreateServiceForm from "./CreateServiceForm";
import "./Services.scss";
import classNames from "classnames";
import { getLocalizedWord } from "helpers/lang";
import { t } from "i18next";

const LIMIT = 9;

const initialFilters = { "category._id": null };

function ServiceHome({ id = undefined }) {
  const initialQueryParams = {
    page: 1,
    limit: LIMIT,
    client: id,
  };
  const [queryParams, setQueryParams] = useState(initialQueryParams);
  const [filter, setFilter] = useState(initialFilters);

  const {
    data: servicesData,
    isLoading,
    mutate,
  } = useSWR(
    id
      ? [`view-${id}-services`, { ...queryParams, provider: id }]
      : [`view-all-services`, queryParams],
    ([, queryParams]) => clientServices.listAllServices(queryParams)
  );
  const { data: categories } = useSWR("services-categories", () =>
    clientServices
      .listAllCategories({ type: "service" })
      .then((data) => data.records)
  );
  const { records: services = undefined, counts = 0 } = servicesData ?? {};

  const renderObj = {
    isLoading,
    list: services,
    render: (service: IService) => (
      <ServiceCard service={service} refetch={mutate} />
    ),
  };

  useLayoutEffect(() => {
    setFilter(initialFilters);
    if (id) setQueryParams((q) => ({ ...q, client: id }));
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
              setQueryParams(initialQueryParams);
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
                setQueryParams(initialQueryParams);
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
      panel: <ServiceHome id={localStorage.getItem("userId") ?? ""} />,
      role: "subscribed",
    },
  };

  return (
    <div className="page-wrapper app-card-shadow px-0 md:px-4 lg:px-6 py-8 m-8">
      <Tabs tabs={tabs} />
    </div>
  );
}
