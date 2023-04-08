import Tabs from "components/Tabs/Tabs";
import { getLocalizedWord } from "helpers/lang";
import { listRenderFn } from "helpers/rednerFn";
import { useLayoutEffect, useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";
import "./Services.scss";
import Pagination from "components/Pagination/Pagination";

const LIMIT = 2;
function ServiceHome({ id = undefined }) {
  const initialQueryParams = { page: 1, limit: LIMIT };
  const [queryParams, setQueryParams] = useState(initialQueryParams);
  const { data: servicesData, isLoading } = useSWR(
    [`view-${id ?? "all"}-services`, queryParams],
    ([, queryParams]) => clientServices.listAllServices(queryParams)
  );
  const { records: services = undefined, counts = 0 } = servicesData ?? {};
  const totalPages = Math.ceil(counts / LIMIT);

  const renderObj = {
    isLoading,
    list: services,
    render: (service) => {
      return (
        <div
          key={service._id}
          className="w-64 bg-primary/20 hover:bg-primary/70 transition-colors shadow rounded-lg p-5 flex flex-col gap-3"
        >
          <h5>{getLocalizedWord(service.providerName)}</h5>
          <p className="font-semibold">
            {getLocalizedWord(service.serviceName)}
          </p>
          <p>{getLocalizedWord(service.description)}</p>
        </div>
      );
    },
  };

  useLayoutEffect(() => {
    if (id) setQueryParams((q) => ({ ...q, client: id }));
    else setQueryParams(initialQueryParams);
  }, [id]);

  return (
    <div className="flex flex-col h-full flex-grow my-8">
      <div className="flex flex-row gap-4 flex-wrap my-8">
        {listRenderFn(renderObj)}
      </div>
      <Pagination
        count={totalPages}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
    </div>
  );
}

export default function Services() {
  const tabs = {
    home: {
      label: "Home",
      panel: <ServiceHome />,
    },

    createJob: {
      label: "Create Job",
      panel: <div>Hi</div>,
    },

    viewCreatedJob: {
      label: "View Created Job",
      panel: <ServiceHome id={localStorage.getItem("userId") ?? ""} />,
    },
  };

  return (
    <div className="page-wrapper app-card-shadow px-0 md:px-5 lg:px-8 py-8 m-8">
      <Tabs tabs={tabs} />
    </div>
  );
}
