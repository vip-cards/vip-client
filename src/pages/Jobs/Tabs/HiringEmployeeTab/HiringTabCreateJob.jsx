import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import clientServices from "services/clientServices";

export default function ApplyJobCreateJob() {
  const ref = useRef(null);
  const userId = localStorage.getItem("userId");

  const [formError, setFormError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [jobForm, setJobForm] = useState({ client: userId, category: "" });

  const formData = [
    {
      name: "name",
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
      name: "category",
      type: "list",
      required: false,
      className: "category-input",
      list: [],
    },
    { name: "phone", type: "phone", required: true, className: "phone-input" },
    {
      name: "cvLink",
      type: "text",
      required: true,
      className: "address-input",
    },
  ];

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const newJobForm = {
      client: jobForm.client,
      name: {
        en: jobForm.name,
      },
      jobTitle: {
        en: jobForm.jobTitle,
      },
      description: {
        en: jobForm.description,
      },
      phone: jobForm.phone,
      link: jobForm.cvLink,
    };

    // const { value, error } = createJobSchema.validate(newJobForm);

    if (false) {
      setFormError(true);
    } else {
      setFormError(false);
      clientServices
        .createPost(newJobForm)
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
      <div className="create-post-container flex flex-col gap-6">
        {formData.map((formInput, index) => {
          return (
            <MainInput
              key={index}
              name={formInput.name}
              type={formInput.type}
              required={formInput.required}
              className={formInput.className}
              state={jobForm}
              setState={setJobForm}
            />
          );
        })}
        {formError && (
          <p className="error-message">Please check the input values</p>
        )}
        <MainButton text="confirm" type="submit" className="confirm" />
      </div>
    </form>
  );
}
