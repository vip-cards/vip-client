import { ServiceCard } from "components/Cards";
import Pagination from "components/Pagination/Pagination";
import Tabs from "components/Tabs/Tabs";
import { listRenderFn } from "helpers/renderFn";
import { useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";
import CreateServiceForm from "./CreateServiceForm";
import "./Services.scss";
import {
  PageQueryWrapper,
  SearchBar,
  SearchProvider,
} from "components/PageQueryContainer/PageQueryContext";

const LIMIT = 9;
const initialQueryParams = { page: 1, limit: LIMIT };

function ServiceHome({ id = undefined }) {
  const [queryParams, setQueryParams] = useState(initialQueryParams);
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

  const { records: services = undefined, counts = 0 } = servicesData ?? {};

  const renderObj = {
    isLoading,
    list: services,
    render: (service: IService) => (
      <ServiceCard service={service} refetch={mutate} />
    ),
  };

  return (
    <SearchProvider
      limit={LIMIT}
      itemsCount={counts}
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
      <div className="flex flex-col h-full flex-grow">
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
