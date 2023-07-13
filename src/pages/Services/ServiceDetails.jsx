import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import BreadCrumb from "components/BreadCrumb/BreadCrumb";
import { MainButton } from "components/Buttons";
import CardContainer from "components/CardContainer/CardContainer";
import FormErrorMessage from "components/FormErrorMessage/FormErrorMessage";
import { MainInput } from "components/Inputs";
import { LoadingSkeleton } from "components/LoadingSkeleton/LoadingSkeleton";
import dayjs from "dayjs";
import { getInitialFormData } from "helpers/forms";
import { getLocalizedWord } from "helpers/lang";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import clientServices from "services/clientServices";
import { selectAuth } from "store/auth-slice";
import useSWR from "swr";
import {
  serviceForm as serviceFormData,
  serviceSchema,
} from "helpers/forms/service";
import { clearEmpty } from "helpers";

/**
 * {obj1} new object
 * {obj2} old object
 */
const getUpdatedOnly = (obj1, obj2) => {
  const editData = {};
  Object.keys(obj1).forEach((key) => {
    if (obj1[key] !== obj2[key]) {
      editData[key] = obj1[key];
    }
  });
  return editData;
};

export function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);

  const [cv, setCV] = useState("");
  const [oldData, setOldData] = useState({});
  const [toEdit, setToEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);

  const { data: { records = [] } = {} } = useSWR("service-category", () =>
    clientServices.listAllCategories({ type: "service" })
  );

  const [serviceForm, setServiceForm] = useState({
    ...getInitialFormData(serviceFormData(records)),
    client: localStorage.getItem("userId"),
    category: [],
  });

  const formData = serviceFormData(records);

  const {
    data: service,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    `${id}-service`,
    async () => (await clientServices.getService(id))?.record[0],
    {
      onSuccess: (data) => {
        setOldData((d) => ({
          ...d,
          ...data,
          serviceName: getLocalizedWord(data.serviceName),
          providerName: getLocalizedWord(data.providerName),
          description: getLocalizedWord(data.description),
          address: getLocalizedWord(data.address),
          phone: data.contacts.phone,
          whatsapp: data.contacts.whatsapp,
          telegram: data.contacts.telegram,
          category: data.category.map((item) => item._id),
        }));
      },
    }
  );

  const job = service ?? {};
  const jobUser = job?.provider?._id ?? "";
  const currentUser = auth.userData._id ?? "";
  const createdByMe = currentUser === jobUser;

  const handleRemoveService = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);
    clientServices
      .removeService(id)
      .then(() => {
        toastPopup.success("Removed successfully!");
        navigate("/services");
      })
      .catch(responseErrorToast)
      .finally(() => setLoading(false));
  };
  const handleEditService = () => {
    setToEdit(true);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    setErrorList([]);
    const _form = clearEmpty(serviceForm);

    const arabicReg = /[\u0621-\u064A]/g;
    const isArabic = (q) => arabicReg.test(q);
    if (error) return setErrorList(error.details.map((e) => e.message));

    const newServiceForm = {
      provider: serviceForm.client,
      serviceName: {
        [isArabic(serviceForm["serviceName"]) ? "ar" : "en"]:
          serviceForm["serviceName"],
      },
      providerName: {
        [isArabic(serviceForm["providerName"]) ? "ar" : "en"]:
          serviceForm["providerName"],
      },

      description: {
        [isArabic(serviceForm["description"]) ? "ar" : "en"]:
          serviceForm["description"],
      },
      address: {
        [isArabic(serviceForm["address"]) ? "ar" : "en"]:
          serviceForm["address"],
      },
      contacts: {
        phone: serviceForm.phone,
        whatsapp: serviceForm.whatsapp,
        telegram: serviceForm.telegram,
      },
      category: serviceForm.category.map((item) => ({ _id: item })),
    };

    const _upd = getUpdatedOnly(newServiceForm, oldData);
    clientServices.updateService(id, _upd).then((res) => {
      toastPopup.success("Updated Successfully");
      navigate(0);
    });
  };
  useEffect(() => {
    setServiceForm(oldData);
  }, [oldData]);

  if (isLoading || loading)
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
    <CardContainer
      title={getLocalizedWord(service.providerName)}
      className="relative"
    >
      {createdByMe && (
        <div className="absolute ltr:right-3 top-16 flex flex-col gap-3 rtl:left-3">
          <button
            className="text-amber-800 hover:text-amber-600 bg-white active:scale-90 transition-all duration-75
            "
            onClick={handleEditService}
          >
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button
            className="text-red-800 hover:text-red-600 active:scale-90 transition-transform bg-white"
            onClick={handleRemoveService}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      )}
      <BreadCrumb pathList={[{ title: "services", link: "/services" }]} />
      <section className={classNames({ "!hidden": !toEdit })}>
        <form
          className="create-job-panel"
          onSubmit={onSubmitHandler}
          noValidate
        >
          <div className="w-full flex flex-col mt-8 mx-auto max-w-[20rem] gap-4 sm:max-w-[30rem]">
            {!!toEdit &&
              formData?.map((formInput, index) => {
                return (
                  <MainInput
                    key={formInput.name}
                    {...formInput}
                    state={serviceForm}
                    setState={setServiceForm}
                  />
                );
              })}
            <FormErrorMessage errorList={errorList} />

            <MainButton
              text={t("confirm")}
              type="submit"
              className="confirm"
              loading={loading}
            />
          </div>
        </form>
      </section>
      <div
        className={classNames("flex flex-col divide-y-2 gap-4", {
          "!hidden": toEdit,
        })}
      >
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
