import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import clientServices from "services/clientServices";
import useSWR from "swr";

export default function ApplyJobCreateJob() {
  const ref = useRef(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [formError, setFormError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [jobForm, setJobForm] = useState({ client: userId, category: "" });
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    "jobs-categories",
    () => clientServices.listAllCategories({ type: "job" })
  );
  console.log(data?.records);

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
      type: "multi-select",
      required: false,
      className: "category-input",
      identifier: "name",
      list: data?.records ?? [],
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
      required: false,
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

    // const { value, error } = createJobSchema.validate(newJobForm);

    if (false) {
      setFormError(true);
    } else {
      setFormError(false);
      setLoading(true);
      clientServices
        .createJob(newJobForm)
        .then((res) => {
          toast.success("Created Successfully");
          navigate("/jobs/apply",);
        })
        .finally(() => setLoading(false));
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
              {...formInput}
            />
          );
        })}
        {formError && (
          <p className="error-message">Please check the input values</p>
        )}
        <MainButton
          text="confirm"
          type="submit"
          className="confirm"
          loading={loading}
        />
      </div>
    </form>
  );
}
