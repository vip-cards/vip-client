import { MainButton } from "components/Buttons";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import i18n from "../../../locales/i18n";
import clientServices from "../../../services/clientServices";

export default function JobPage() {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const lang = i18n.language;
  console.log(id);

  useEffect(() => {
    clientServices.getJobDetails(id).then(({ data }) => setJob(data.record[0]));
  }, []);

  return (
    <main className="job-details-page app-card-shadow">
      <header className="job-details-header">
        <h2 className="job-company">
          {job?.companyName?.[lang] ||
            job?.companyName?.en ||
            job?.companyName?.ar}
        </h2>
        <h3 className="job-title">
          {job?.jobTitle?.[lang] || job?.jobTitle?.en || job?.jobTitle?.ar}
        </h3>
      </header>
      <section className="job-details-details">
        <p className="details-header">Details</p>
        <h4>
          {job?.description?.[lang] ||
            job?.description?.en ||
            job?.description?.ar}
        </h4>
        <h5>{job?.address?.[lang] || job?.address?.en || job?.address?.ar}</h5>
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
              <div>{item.name[lang] || item.name.en || item.name.ar}</div>
              <a href={item.link} target="_blank" rel="noreferrer">
                <MainButton className="cv-btn" text="Show CV" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
