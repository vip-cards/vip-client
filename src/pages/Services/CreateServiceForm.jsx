import { MainButton } from "components/Buttons";
import FormErrorMessage from "components/FormErrorMessage/FormErrorMessage";
import { MainInput } from "components/Inputs";
import { clearEmpty } from "helpers";
import { getInitialFormData } from "helpers/forms";
import {
  serviceForm as serviceFormData,
  serviceSchema,
} from "helpers/forms/service";
import toastPopup from "helpers/toastPopup";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import clientServices from "services/clientServices";
import useSWR from "swr";

export default function CreateServiceForm() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const navigate = useNavigate();
  const [errorList, setErrorList] = useState([]);

  const { data: { records = [] } = {} } = useSWR("service-category", () =>
    clientServices.listAllCategories({ type: "service" })
  );

  const [serviceForm, setServiceForm] = useState({
    ...getInitialFormData(serviceFormData(records)),
    client: userId,
    category: [],
  });

  const formData = serviceFormData(records);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setErrorList([]);
    const _form = clearEmpty(serviceForm);
    const { value: _service, error } = serviceSchema.validate(_form);

    const arabicReg = /[\u0621-\u064A]/g;
    const isArabic = (q) => arabicReg.test(q);
    if (error) return setErrorList(error.details.map((e) => e.message));

    const newServiceForm = {
      provider: _service.client,
      serviceName: {
        [isArabic(_service["serviceName"]) ? "ar" : "en"]:
          _service["serviceName"],
      },
      providerName: {
        [isArabic(_service["providerName"]) ? "ar" : "en"]:
          _service["providerName"],
      },

      description: {
        [isArabic(_service["description"]) ? "ar" : "en"]:
          _service["description"],
      },
      address: {
        [isArabic(_service["address"]) ? "ar" : "en"]: _service["address"],
      },
      contacts: {
        phone: _service.phone,
        whatsapp: _service.whatsapp,
        telegram: _service.telegram,
      },
      category: _service.category.map((item) => ({ _id: item })),
    };

    clientServices.createService(newServiceForm).then((res) => {
      toastPopup.success("Created Successfully");
      navigate(0);
    });
  };

  return (
    <form
      ref={ref}
      className="create-service-panel"
      onSubmit={onSubmitHandler}
      noValidate
    >
      <div className="flex flex-col gap-5 my-8 w-[80%]">
        {formData.map((formInput, index) => {
          return (
            <MainInput
              key={index}
              className="w-full max-w-sm mx-auto"
              state={serviceForm}
              setState={setServiceForm}
              {...formInput}
            />
          );
        })}
        <FormErrorMessage errorList={errorList} />

        <MainButton
          text={t("confirm")}
          type="submit"
          className="w-full max-w-sm mx-auto"
        />
      </div>
    </form>
  );
}
