import CardContainer from "components/CardContainer/CardContainer";
import { LoadingSkeleton } from "components/LoadingSkeleton/LoadingSkeleton";
import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { useParams } from "react-router";
import clientServices from "services/clientServices";
import useSWR from "swr";
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
