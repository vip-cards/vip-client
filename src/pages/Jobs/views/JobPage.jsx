import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import BreadCrumb from "components/BreadCrumb/BreadCrumb";
import { MainButton } from "components/Buttons";
import FormErrorMessage from "components/FormErrorMessage/FormErrorMessage";
import { MainInput } from "components/Inputs";
import { motion } from "framer-motion";
import { getInitialFormData } from "helpers/forms";
import { jobForm as jobFormData } from "helpers/forms/job";
import { getLocalizedWord } from "helpers/lang";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import clientServices from "services/clientServices";
import { selectAuth } from "store/auth-slice";
import useSWR from "swr";

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

export default function JobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector(selectAuth);

  const [cv, setCV] = useState("");
  const [oldData, setOldData] = useState({});
  const [toEdit, setToEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);

  const { data: jobData, isLoading } = useSWR(
    ["job-detail", id],
    ([, id]) => clientServices.getJobDetails(id),
    {
      onSuccess: (data) => {
        const _job = data.record[0];
        setOldData((obj) => ({
          ...obj,
          companyName: getLocalizedWord(_job.companyName),
          jobTitle: getLocalizedWord(_job.jobTitle),
          description: getLocalizedWord(_job.description),
          address: getLocalizedWord(_job.address),
          phone: _job.contacts?.phone ?? "",
          whatsapp: _job.contacts?.whatsapp ?? "",
          telegram: _job.contacts?.telegram ?? "",
          category: _job.category.map((cat) => cat._id), //this turn around
        }));
      },
    }
  );
  const job = jobData?.record[0] ?? {};
  const jobUser = job?.client?._id ?? "";
  const currentUser = auth.userData._id ?? "";
  const createdByMe = currentUser === jobUser;

  const { data: categories } = useSWR("jobs-categories", () =>
    clientServices
      .listAllCategories({ type: "job" })
      .then((data) => data.records)
  );
  const [jobForm, setJobForm] = useState({
    ...getInitialFormData(jobFormData(categories)),
    client: auth.userData._id,
  });
  const formData = jobFormData(categories);

  const applyJobHandler = () => {
    clientServices
      .applyToJob(id, {
        _id: auth.userId,
        name: auth.userData.name,
        profession: auth.userData.profession,
        link: cv,
      })
      .then(() => {
        toastPopup.success("Applied Succefully!");
        navigate("/jobs");
      })
      .catch((e) =>
        toastPopup.error(e?.response?.data?.error ?? "something went wrong!")
      );
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setErrorList([]);

    const arabicReg = /[\u0621-\u064A]/g;
    const isArabic = (q) => arabicReg.test(q);

    const newJobForm = {
      client: jobForm.client,
      companyName: {
        [isArabic(jobForm["companyName"]) ? "ar" : "en"]:
          jobForm["companyName"],
      },
      jobTitle: {
        [isArabic(jobForm["jobTitle"]) ? "ar" : "en"]: jobForm["jobTitle"],
      },
      description: {
        [isArabic(jobForm["description"]) ? "ar" : "en"]:
          jobForm["description"],
      },
      address: {
        [isArabic(jobForm["address"]) ? "ar" : "en"]: jobForm["address"],
      },
      contacts: {
        phone: jobForm.phone?.toString(),
        whatsapp: jobForm.whatsapp?.toString(),
        telegram: jobForm.telegram?.toString(),
      },
      category: jobForm.category,
    };

    const _jobbUpdated = getUpdatedOnly(newJobForm, oldData);
    setLoading(true);
    clientServices
      .updateJob(_jobbUpdated, { _id: id, client: jobUser })
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
      .removeJob(id)
      .then(() => {
        toastPopup.success("Removed successfully!");
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
    <div className="jobs-page mt-3 relative">
      <motion.main
        className="job-details-page app-card-shadow relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
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
        <motion.header
          className={classNames("job-details-header", { "!hidden": toEdit })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <motion.h2
            className="job-company"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {getLocalizedWord(job?.companyName)}
          </motion.h2>
          <motion.h3
            className="job-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {getLocalizedWord(job?.jobTitle)}
          </motion.h3>
        </motion.header>
        <motion.section
          className={classNames("job-details-details", { "!hidden": toEdit })}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="details-header">{t("Details")}</p>
          <h4>{getLocalizedWord(job?.description)}</h4>
          <h5>{getLocalizedWord(job?.address)}</h5>
          <div className="contact-row">
            <h6>{t("Phone")}</h6>
            <p>{job?.contacts?.phone}</p>
          </div>
          <div className="contact-row">
            <h6>{t("Whatsapp")}</h6>
            <p>{job?.contacts?.whatsapp}</p>
          </div>
          <div className="contact-row">
            <h6>{t("Telegram")}</h6>
            <p>{job?.contacts?.telegram}</p>
          </div>
        </motion.section>
        <hr />
        {createdByMe && !!job?.applicants.length && (
          <>
            <hr />
            <section className={"job-details-applicants"}>
              <h4>{t("Applicants")}</h4>
              <motion.div layout className="applicants-container">
                {job?.applicants?.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="applicant-card"
                  >
                    <div>{getLocalizedWord(item.name)}</div>
                    <a href={item.link} target="_blank" rel="noreferrer">
                      <MainButton className="cv-btn" text="Show CV" />
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </section>
          </>
        )}
        {!createdByMe && (
          <footer className="flex flex-row w-full gap-4 justify-around items-center">
            <MainInput
              name="CV link"
              className="flex-grow"
              onChange={(e) => setCV(e.target.value)}
            />
            <MainButton size="medium" onClick={applyJobHandler}>
              {t("Apply")}
            </MainButton>
          </footer>
        )}
      </motion.main>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="animate-pulse max-xs:w-36 max-sm:w-56 w-64 max-w-full h-7 bg-primary/20 rounded-lg"></div>
);
