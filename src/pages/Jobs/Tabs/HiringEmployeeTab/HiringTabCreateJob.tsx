import { MainButton } from "components/Buttons";
import FormErrorMessage from "components/FormErrorMessage/FormErrorMessage";
import { MainInput } from "components/Inputs";
import { clearEmpty } from "helpers";
import { getInitialFormData } from "helpers/forms";
import { postForm, postSchema } from "helpers/forms/post";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import clientServices from "services/clientServices";

import useSWR from "swr";

export default function HiringTabCreateJob() {
  const userId = localStorage.getItem("userId");

  const ref = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);

  const { data: categories } = useSWR("posts-categories", () =>
    clientServices
      .listAllCategories({ type: "job" })
      .then((data) => data.records)
  );
  const [jobForm, setJobForm] = useState({
    ...getInitialFormData(postForm(categories)),
    client: userId,
  });

  const formData = postForm(categories);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setErrorList([]);
    const _form = clearEmpty(jobForm);
    const { value: _job, error } = postSchema.validate(_form);

    const arabicReg = /[\u0621-\u064A]/g;
    const isArabic = (q) => arabicReg.test(q);
    if (error) return setErrorList(error.details.map((e) => e.message));

    const newJobForm = {
      client: _job.client,
      name: {
        [isArabic(_job["name"]) ? "ar" : "en"]: _job["companyName"],
      },
      jobTitle: {
        [isArabic(_job["jobTitle"]) ? "ar" : "en"]: _job["jobTitle"],
      },
      description: {
        [isArabic(_job["description"]) ? "ar" : "en"]: _job["description"],
      },
      phone: _job.phone,
      link: _job.cvLink,
      category: _job.category,
    };
    setLoading(true);

    clientServices
      .createPost(newJobForm)
      .then((res) => {
        toastPopup.success("Created Successfully");
        navigate("/jobs");
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
      <div className="create-post-container w-full flex flex-col mt-8  gap-4 sm:max-w-[80%]">
        {formData.map((formInput, index) => {
          return (
            <MainInput
              key={formInput.name}
              {...formInput}
              state={jobForm}
              setState={setJobForm}
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
