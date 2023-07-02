import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import { getLocalizedWord } from "helpers/lang";
import toastPopup from "helpers/toastPopup";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import clientServices from "services/clientServices";
import { selectAuth } from "store/auth-slice";
import useSWR from "swr";
import { motion } from "framer-motion";

export default function JobPage() {
  const auth = useSelector(selectAuth);
  const navigate = useNavigate();
  const { id } = useParams();
  const [cv, setCV] = useState("");
  const {
    data: jobData,
    isLoading,
  } = useSWR(["job-detail", id], ([, id]) => clientServices.getJobDetails(id));
  const job = jobData?.record[0] ?? {};

  const applyJobHandler = () => {
    const data = clientServices
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
  if (isLoading)
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
      <motion.main
        className="job-details-page app-card-shadow"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <motion.header
          className="job-details-header"
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
          className="job-details-details"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <p className="details-header">Details</p>
          <h4>{getLocalizedWord(job?.description)}</h4>
          <h5>{getLocalizedWord(job?.address)}</h5>
          <div className="contact-row">
            <h6>Phone</h6>
            <p>{job?.contacts?.phone}</p>
          </div>
          <div className="contact-row">
            <h6>Whatsapp</h6>
            <p>{job?.contacts?.whatsapp}</p>
          </div>
          <div className="contact-row">
            <h6>Telegram</h6>
            <p>{job?.contacts?.telegram}</p>
          </div>
        </motion.section>
        <hr />
        {/* <section className="job-details-applicants">
        <h4>Applicants</h4>
        <div className="applicants-container">
          {job?.applicants?.map((item) => (
            <div key={item._id} className="applicant-card">
              <div>{getLocalizedWord(item.name)}</div>
              <a href={"//" + item.link} target="_blank" rel="noreferrer">
                <MainButton className="cv-btn" text="Show CV" />
              </a>
            </div>
          ))}
        </div>
      </section> */}
        <footer className="flex flex-row w-full gap-4 justify-around items-center">
          <MainInput
            name="CV link"
            className="flex-grow"
            onChange={(e) => setCV(e.target.value)}
          />
          <MainButton size="medium" onClick={applyJobHandler}>
            Apply
          </MainButton>
        </footer>
      </motion.main>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="animate-pulse max-xs:w-36 max-sm:w-56 w-64 max-w-full h-7 bg-primary/20 rounded-lg"></div>
);
