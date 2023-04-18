import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import { getLocalizedWord } from "helpers/lang";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import clientServices from "services/clientServices";
import { selectAuth } from "store/auth-slice";
import useSWR from "swr";

export default function JobPage() {
  const auth = useSelector(selectAuth);
  const { id } = useParams();
  const [cv, setCV] = useState("");
  const {
    data: jobData,
    isLoading,
    isValidating,
  } = useSWR(["job-detail", id], ([, id]) => clientServices.getJobDetails(id));
  const job = jobData?.record[0] ?? {};

  const applyJobHandler = () => {
    const data = clientServices.applyToJob(id, {
      _id: id,
      name: auth.userData.name,
      profession: auth.userData.profession,
      link: cv,
    });
  };
  if (isLoading)
    return (
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
    );

  return (
    <main className="job-details-page app-card-shadow">
      <header className="job-details-header">
        <h2 className="job-company">{getLocalizedWord(job?.companyName)}</h2>
        <h3 className="job-title">{getLocalizedWord(job?.jobTitle)}</h3>
      </header>
      <section className="job-details-details">
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
      </section>
      <hr />
      <section className="job-details-applicants">
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
      </section>
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
    </main>
  );
}

const LoadingSkeleton = () => (
  <div className="animate-pulse w-64 h-7 bg-primary/20 rounded-lg"></div>
);
