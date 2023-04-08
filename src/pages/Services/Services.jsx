import CardContainer from "components/CardContainer/CardContainer";
import { LoadingSkeleton } from "components/LoadingSkeleton/LoadingSkeleton";
import Pagination from "components/Pagination/Pagination";
import Tabs from "components/Tabs/Tabs";
import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { listRenderFn } from "helpers/rednerFn";
import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import clientServices from "services/clientServices";
import useSWR from "swr";
import ApplyJobCreateJob from "./CreateServiceForm";

import "./Services.scss";

const LIMIT = 9;

export function ServiceDetails() {
  const { id } = useParams();
  const {
    data: service,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    `${id}-service`,
    async () => (await clientServices.getService(id))?.record[0]
  );

  if (isLoading)
    return (
      <CardContainer title="Service Provider">
        <div className="flex flex-col divide-y-2 gap-4">
          <div className="flex flex-col border-b-slate-200">
            <h5>Service</h5>
            <p className="text-lg">
              <LoadingSkeleton />
            </p>
          </div>
          <div className="flex flex-col border-b-slate-200">
            <h5>Description</h5>
            <p className="text-lg max-w-[80%]">
              <LoadingSkeleton />
            </p>
          </div>
          <div className="flex flex-col border-b-slate-200">
            <h5>Contacts</h5>
            <div className="flex flex-col gap-2 ml-1 w-fit">
              <div>
                <h6 className="text-xl">Phone</h6>
                <p className="text-lg">
                  <LoadingSkeleton width="10rem" />
                </p>
              </div>
              <div>
                <h6 className="text-xl">Whatsapp</h6>
                <p className="text-lg">
                  <LoadingSkeleton width="10rem" />
                </p>
              </div>
              <div>
                <h6 className="text-xl">Telegram</h6>
                <p className="text-lg">
                  <LoadingSkeleton width="10rem" />
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col border-b-slate-200">
            <h5>Address</h5>
            <p className="text-lg">
              {" "}
              <LoadingSkeleton />
            </p>
          </div>
          <div className="flex flex-col border-b-slate-200">
            <h5>Published</h5>
            <p className="text-lg">
              <LoadingSkeleton />
            </p>
          </div>
        </div>
      </CardContainer>
    );

  return (
    <CardContainer title={getLocalizedWord(service.providerName)}>
      <div className="flex flex-col divide-y-2 gap-4">
        <div className="flex flex-col border-b-slate-200">
          <h5>Service</h5>
          <p className="text-lg">{getLocalizedWord(service.serviceName)}</p>
        </div>
        <div className="flex flex-col border-b-slate-200">
          <h5>Description</h5>
          <p className="text-lg max-w-[80%]">
            {getLocalizedWord(service.description)}
          </p>
        </div>
        <div className="flex flex-col border-b-slate-200">
          <h5>Contacts</h5>
          <div className="flex flex-col gap-2 ml-1 w-fit">
            <div>
              <h6 className="text-xl">Phone</h6>
              <p className="text-lg">{service.contacts.phone ?? ""}</p>
            </div>
            <div>
              <h6 className="text-xl">Whatsapp</h6>
              <p className="text-lg">{service.contacts.whatsapp ?? ""}</p>
            </div>
            <div>
              <h6 className="text-xl">Telegram</h6>
              <p className="text-lg">{service.contacts.telegram ?? ""}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col border-b-slate-200">
          <h5>Address</h5>
          <p className="text-lg">{getLocalizedWord(service.address)}</p>
        </div>
        <div className="flex flex-col border-b-slate-200">
          <h5>Published</h5>
          <p className="text-lg">
            {dayjs(service.publishDate).format("DD-MMMM-YYYY")}
          </p>
        </div>
      </div>
    </CardContainer>
  );
}

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
        <Link
          key={service._id}
          to={`/services/${service._id}`}
          className="text-left w-64 bg-primary/20 hover:bg-primary/70 transition-colors shadow rounded-lg p-5 flex flex-col gap-3"
        >
          <h5 className="whitespace-nowrap overflow-x-hidden text-ellipsis">
            {getLocalizedWord(service.providerName)}
          </h5>
          <p className="font-semibold">
            {getLocalizedWord(service.serviceName)}
          </p>
          <p>{getLocalizedWord(service.description)}</p>
        </Link>
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
      panel: <ApplyJobCreateJob />,
    },

    viewCreatedJob: {
      label: "View Created Job",
      panel: <ServiceHome id={localStorage.getItem("userId") ?? ""} />,
    },
  };

  return (
    <div className="page-wrapper app-card-shadow px-0 md:px-4 lg:px-6 py-8 m-8">
      <Tabs tabs={tabs} />
    </div>
  );
}
