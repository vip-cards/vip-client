import classNames from "classnames";
import { MainButton } from "components/Buttons";
import FormErrorMessage from "components/FormErrorMessage/FormErrorMessage";
import { MainInput } from "components/Inputs";
import { clearEmpty } from "helpers";
import { getInitialFormData } from "helpers/forms";
import { jobForm as jobFormData, jobSchema } from "helpers/forms/job";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import clientServices from "services/clientServices";
import useSWR from "swr";

export default function ApplyJobCreateJob() {
  const userId = localStorage.getItem("userId");

  const ref = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formError, setFormError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    "jobs-categories",
    () => clientServices.listAllCategories({ type: "job" })
  );
  const [jobForm, setJobForm] = useState({
    ...getInitialFormData(jobFormData(data?.records)),
    client: userId,
  });

  const formData = jobFormData(data?.records);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setErrorList([]);
    const _form = clearEmpty(jobForm);
    const { value: _job, error } = jobSchema.validate(_form);

    const arabicReg = /[\u0621-\u064A]/g;
    const isArabic = (q) => arabicReg.test(q);
    if (error) return setErrorList(error.details.map((e) => e.message));

    const newJobForm = {
      client: _job.client,
      companyName: {
        [isArabic(_job["companyName"]) ? "ar" : "en"]: _job["companyName"],
      },
      jobTitle: {
        [isArabic(_job["jobTitle"]) ? "ar" : "en"]: _job["jobTitle"],
      },
      description: {
        [isArabic(_job["description"]) ? "ar" : "en"]: _job["description"],
      },
      address: {
        [isArabic(_job["address"]) ? "ar" : "en"]: _job["address"],
      },
      contacts: {
        phone: _job.phone,
        whatsapp: _job.whatsapp,
        telegram: _job.telegram,
      },
      category: _job.category,
    };

    setLoading(true);
    clientServices
      .createJob(newJobForm)
      .then((res) => {
        toastPopup.success("Created Successfully");
        navigate("/jobs/apply");
      })
      .catch(responseErrorToast)
      .finally(() => setLoading(false));
  };

  return (
    <form
      ref={ref}
      className="create-job-panel"
      onSubmit={onSubmitHandler}
      noValidate
    >
      <div className="w-full flex flex-col mt-8  gap-4 sm:max-w-[80%]">
        {formData.map(({ className, ...formInput }, index) => {
          const cls = classNames({ "col-span-1": true }, className);

          return (
            <MainInput
              key={index}
              name={formInput.name}
              type={formInput.type}
              required={formInput.required}
              className={cls}
              withLang={formInput.withlang}
              state={jobForm}
              setState={setJobForm}
              {...formInput}
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
  );
}
