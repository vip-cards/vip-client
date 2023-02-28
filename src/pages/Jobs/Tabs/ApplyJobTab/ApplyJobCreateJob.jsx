import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import MainButton from "../../../../components/MainButton/MainButton";
import MainInput from "../../../../components/MainInput/MainInput";
import { createJobSchema } from "../../../../helpers/schemas";
import clientServices from "../../../../services/clientServices";

export default function ApplyJobCreateJob() {
  const userId = localStorage.getItem("userId");
  const [formError, setFormError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const ref = useRef(null);
  const [jobForm, setJobForm] = useState({
    client: userId,
  });
  const formData = [
    {
      name: "companyName",
      type: "text",
      required: true,
      className: "company-input",
      withlang: "en",
    },
    { name: "jobTitle", type: "text", required: true, className: "job-input" },
    {
      name: "description",
      type: "textarea",
      required: true,
      className: "description-input",
    },
    {
      name: "address",
      type: "text",
      required: true,
      className: "address-input",
    },
    {
      name: "category",
      type: "list",
      required: false,
      className: "category-input",
      list: [],
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

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const newJobForm = {
      client: jobForm.client,
      companyName: {
        en: jobForm.companyName,
      },
      jobTitle: {
        en: jobForm.jobTitle,
      },
      description: {
        en: jobForm.description,
      },
      address: {
        en: jobForm.address,
      },
      contacts: {
        phone: jobForm.phone,
        whatsapp: jobForm.whatsapp,
        telegram: jobForm.telegram,
      },
    };
    const { value, error, warning } = createJobSchema.validate(newJobForm);
    console.log(value);
    console.log(error);
    console.log(warning);
    if (error) {
      setFormError(true);
    } else {
      setFormError(false);
      clientServices
        .createJob(value)
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
    <form ref={ref} className="create-job-panel" onSubmit={onSubmitHandler}>
      <div className="create-job-container">
        {formData.map((formInput, index) => {
          return (
            <MainInput
              key={index}
              name={formInput.name}
              type={formInput.type}
              required={formInput.required}
              className={formInput.className}
              withLang={formInput.withlang}
              state={jobForm}
              setState={setJobForm}
            />
          );
        })}
        {formError && (
          <p className="error-message">Please check the input values</p>
        )}
        <MainButton
          disabled={disabled}
          text="confirm"
          type="submit"
          className="confirm"
        />
      </div>
    </form>
  );
}
