import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import clientServices from "services/clientServices";
import useSWR from "swr";

export default function CreateServiceForm() {
  const ref = useRef(null);
  const userId = localStorage.getItem("userId");

  const [formError, setFormError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [jobForm, setJobForm] = useState({ client: userId, category: "" });
  const {
    data: { records = [] } = {},
    error,
    isLoading,
    isValidating,
  } = useSWR("service-category", () =>
    clientServices.listAllCategories({ type: "service" })
  );

  console.log(records);
  const formData = [
    {
      name: "serviceName.en",
      type: "text",
      required: true,
      className: "grid-service-en",
    },
    {
      name: "serviceName.ar",
      type: "text",
      required: true,
      className: "grid-service-ar",
    },
    {
      name: "providerName.en",
      type: "text",
      required: true,
      className: "provider-input-en",
    },
    {
      name: "providerName.ar",
      type: "text",
      required: true,
      className: "provider-input-ar",
    },
    {
      name: "description.en",
      type: "textarea",
      required: true,
      className: "description-input-en h-[7rem]",
    },
    {
      name: "description.ar",
      type: "textarea",
      required: true,
      className: "description-input-ar h-[7rem]",
    },
    {
      name: "address.en",
      type: "text",
      required: true,
      className: "address-input-en",
    },
    {
      name: "address.ar",
      type: "text",
      required: true,
      className: "address-input-ar",
    },
    {
      name: "category",
      type: "list",
      required: false,
      className: "category-input",
      list: [...records],
      identifier: "name",
    },
    { name: "phone", type: "phone", required: true, className: "phone-input" },
    {
      name: "whatsapp",
      type: "phone",
      required: true,
      className: "whatsapp-input",
    },
    {
      name: "telegram",
      type: "phone",
      required: true,
      className: "telegram-input",
    },
  ];
  console.log(formData);
  const onSubmitHandler = (e) => {
    e.preventDefault();

    const newJobForm = {
      provider: jobForm.client,
      serviceName: {
        en: jobForm["serviceName.en"],
        ar: jobForm["serviceName.ar"],
      },
      providerName: {
        en: jobForm["providerName.en"],
        ar: jobForm["providerName.ar"],
      },
      name: {
        en: jobForm["providerName.en"],
        ar: jobForm["providerName.ar"],
      },
      description: {
        en: jobForm["description.en"],
        ar: jobForm["description.ar"],
      },
      address: {
        en: jobForm["address.en"],
        ar: jobForm["address.ar"],
      },
      contacts: {
        phone: jobForm.phone,
        whatsapp: jobForm.whatsapp,
        telegram: jobForm.telegram,
      },
      category: records.find((item) => item._id === jobForm.category),
    };

    // const { value, error } = createJobSchema.validate(newJobForm);

    if (false) {
      setFormError(true);
    } else {
      setFormError(false);
      clientServices
        .createJob(newJobForm)
        .then((res) => toast.success("Created Successfully"));
    }
  };

  useEffect(() => {
    formError && setFormError(false);
    if (ref.current && ref.current.checkValidity()) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [jobForm]);

  return (
    <form ref={ref} className="create-service-panel" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-8 my-8 w-[80%]">
        {formData.map((formInput, index) => {
          return (
            <MainInput
              key={index}
              className="w-full max-w-sm mx-auto"
              state={jobForm}
              setState={setJobForm}
              {...formInput}
            />
          );
        })}
        {formError && (
          <p className="error-message">Please check the input values</p>
        )}
      </div>
      <MainButton text="confirm" type="submit" className="confirm" />
    </form>
  );
}
