import Pagination from "components/Pagination/Pagination";
import Tabs from "components/Tabs/Tabs";
import { getLocalizedWord } from "helpers/lang";
import { listRenderFn } from "helpers/renderFn";
import { useState } from "react";
import { Link } from "react-router-dom";
import clientServices from "services/clientServices";
import useSWR from "swr";
import CreateServiceForm from "./CreateServiceForm";

import "./Services.scss";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const LIMIT = 9;

function ServiceHome({ id = undefined }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const initialQueryParams = { page: 1, limit: LIMIT };
  const [queryParams, setQueryParams] = useState(initialQueryParams);
  const { data: servicesData, isLoading } = useSWR(
    id
      ? [`view-${id}-services`, { ...queryParams, provider: id }]
      : [`view-all-services`, queryParams],
    ([, queryParams]) => clientServices.listAllServices(queryParams)
  );
  const { records: services = undefined, counts = 0 } = servicesData ?? {};
  const totalPages = Math.ceil(counts / LIMIT);

  const renderObj = {
    isLoading,
    list: services,
    render: (service) => {
      return (
        <Link
          key={service._id}
          to={`/services/${service._id}`}
          className="w-80 p-4 bg-gray-300 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col gap-2 capitalize cursor-pointer relative h-[185px]"
        >
          <h5 className="whitespace-nowrap font-semibold text-primary text-ellipsis">
            {getLocalizedWord(service.providerName)}
          </h5>
          <p className="font-semibold">
            {getLocalizedWord(service.serviceName)}
          </p>
          <p className="line-clamp-2 mt-auto">
            {getLocalizedWord(service.description)}
          </p>
          <time datetime={service.publishDate} className="self-end">
            {dayjs(service.publishDate).format("DD, MMM")}
          </time>
        </Link>
      );
    },
  };

  return (
    <div className="flex flex-col h-full flex-grow my-8">
      <div className="flex flex-row gap-4 items-center justify-center flex-wrap my-8">
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
