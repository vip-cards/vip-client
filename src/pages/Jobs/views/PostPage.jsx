import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import BreadCrumb from "components/BreadCrumb/BreadCrumb";
import { MainButton } from "components/Buttons";
import FormErrorMessage from "components/FormErrorMessage/FormErrorMessage";
import { MainInput } from "components/Inputs";
import { getInitialFormData } from "helpers/forms";
import { postForm } from "helpers/forms/post";
import { getLocalizedWord } from "helpers/lang";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import clientServices from "services/clientServices";
import { selectAuth } from "store/auth-slice";
import useSWR from "swr";

/** REPEATED ALOOOOOOOOOOT
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

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);

  const [oldData, setOldData] = useState({});
  const [toEdit, setToEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);

  const { data: jobData, isLoading } = useSWR(
    ["post-detail", id],
    ([, id]) => clientServices.getPostDetails(id),
    {
      onSuccess: (data) => {
        const _job = data.record[0];
        setOldData((obj) => ({
          ...obj,
          name: getLocalizedWord(_job.name),
          jobTitle: getLocalizedWord(_job.jobTitle),
          description: getLocalizedWord(_job.description),
          phone: _job?.phone ?? "",
          cvLink: _job.link ?? "",
          category: _job.category.map((cat) => cat._id), //this turn around
        }));
      },
    }
  );
  const job = jobData?.record[0] ?? {};
  const jobUser = job?.client?._id ?? "";
  const currentUser = auth.userData._id ?? "";
  const createdByMe = currentUser === jobUser;

  const { data: categories } = useSWR("posts-categories", () =>
    clientServices
      .listAllCategories({ type: "job" })
      .then((data) => data.records)
  );
  const [jobForm, setJobForm] = useState({
    ...getInitialFormData(postForm(categories)),
    client: auth.userData._id,
  });

  const formData = postForm(categories);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setErrorList([]);
    setLoading(true);

    const arabicReg = /[\u0621-\u064A]/g;
    const isArabic = (q) => arabicReg.test(q);

    const newJobForm = {
      client: jobForm?.client,
      name: {
        [isArabic(jobForm["name"]) ? "ar" : "en"]: jobForm["name"],
      },
      jobTitle: {
        [isArabic(jobForm["jobTitle"]) ? "ar" : "en"]: jobForm["jobTitle"],
      },
      description: {
        [isArabic(jobForm["description"]) ? "ar" : "en"]:
          jobForm["description"],
      },
      phone: jobForm?.phone,
      link: jobForm?.cvLink,
      category: jobForm?.category,
    };

    const _jobbUpdated = getUpdatedOnly(newJobForm, oldData);
    setLoading(true);
    clientServices
      .updatePost(_jobbUpdated, { _id: id, client: jobUser })
      .then((res) => {
        toastPopup.success("Updated Successfully");
        navigate("/jobs");
      })
      .catch(responseErrorToast)
      .finally(() => {
        setToEdit(false);
        setLoading(false);
      });
  };

  const handleRemoveJob = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);
    clientServices
      .removePost(id)
      .then(() => {
        toastPopup.success("Post removed successfully!");
        navigate("/jobs");
      })
      .catch(responseErrorToast)
      .finally(() => setLoading(false));
  };

  const handleEditJob = () => {
    setToEdit(true);
  };

  useEffect(() => {
    setJobForm(oldData);
  }, [oldData]);

  if (isLoading || loading)
    return (
      <div className="jobs-page">
        <main className="job-details-page app-card-shadow">
          <header className="job-details-header">
            <h2 className="job-company">
              <LoadingSkeleton />
            </h2>
            <h3 className="job-title">
              {" "}
              <LoadingSkeleton />
            </h3>
          </header>
          <section className="job-details-details">
            <p className="details-header">Details</p>
            <h4>
              {" "}
              <LoadingSkeleton />
            </h4>
            <h5>
              {" "}
              <LoadingSkeleton />
            </h5>
            <div className="contact-row">
              <h6>Phone</h6>
              <p>
                {" "}
                <LoadingSkeleton />
              </p>
            </div>
            <div className="contact-row">
              <h6>Whatsapp</h6>
              <p>
                {" "}
                <LoadingSkeleton />
              </p>
            </div>
            <div className="contact-row">
              <h6>Telegram</h6>
              <p>
                {" "}
                <LoadingSkeleton />
              </p>
            </div>
          </section>
          <hr />
          <section className="job-details-applicants">
            <h4>Applicants</h4>
            <div className="applicants-container">
              <LoadingSkeleton />
            </div>
          </section>
          <footer className="flex flex-row w-full gap-4 justify-around items-center">
            <LoadingSkeleton />
            <MainButton size="medium">Apply</MainButton>
          </footer>
        </main>
      </div>
    );

  return (
    <div className="jobs-page mt-3">
      <main className="job-details-page app-card-shadow relative">
        {createdByMe && (
          <div className="absolute ltr:right-3 top-16 flex flex-col gap-3 rtl:left-3">
            <button
              className="text-amber-800 hover:text-amber-600 bg-white active:scale-90 transition-all duration-75
            "
              onClick={handleEditJob}
            >
              <FontAwesomeIcon icon={faPencil} />
            </button>
            <button
              className="text-red-800 hover:text-red-600 active:scale-90 transition-transform bg-white"
              onClick={handleRemoveJob}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        )}
        <BreadCrumb pathList={[{ title: "jobs", link: "/jobs" }]} />
        <section className={classNames({ hidden: !toEdit })}>
          <form
            className="create-job-panel"
            onSubmit={onSubmitHandler}
            noValidate
          >
            <div className="w-full flex flex-col mt-8  gap-4 sm:max-w-[80%]">
              {!!toEdit &&
                formData?.map((formInput, index) => {
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
        </section>
        <header
          className={classNames("job-details-header", { "!hidden": toEdit })}
        >
          <h2 className="job-company">{getLocalizedWord(job?.name)}</h2>
          <h3 className="job-title">{getLocalizedWord(job?.jobTitle)}</h3>
        </header>
        <section
          className={classNames("job-details-details", { "!hidden": toEdit })}
        >
          <p className="details-header">Details</p>
          <h4>{getLocalizedWord(job?.description)}</h4>
          <h5>{getLocalizedWord(job?.address)}</h5>
          <div className="contact-row">
            <h6>Phone</h6>
            <p>{job?.phone}</p>
          </div>
        </section>
        <hr />
        <section className="job-details-applicants">
          <div className="applicants-container ml-auto">
            <a href={job.link} target="_blank" rel="noreferrer">
              <MainButton className="cv-btn" text="View CV" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="animate-pulse w-64 h-7 bg-primary/20 rounded-lg"></div>
);
