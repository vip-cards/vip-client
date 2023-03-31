import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import i18n from "../../../../locales/i18n";
import { apiStates, getCreatedJobsThunk } from "../../../../store/jobs-slice";

export default function ApplyJobViewCreatedJob() {
  const dispatch = useDispatch();
  const {
    created,
    items: createdJobs,
    fetchState,
  } = useSelector((state) => state.jobs.createdJobs);
  const [page, setPage] = useState(1);
  const lang = i18n.language;

  useEffect(() => {
    //cache in store for 5 minutes
    if (
      dayjs(created).isBefore(dayjs().subtract(5, "minute")) ||
      fetchState === apiStates.IDLE
    ) {
      dispatch(getCreatedJobsThunk({ page })).unwrap();
    }
  }, []);

  //TODO: pagination is not working yet
  useEffect(() => {
    dispatch(getCreatedJobsThunk({ page })).unwrap();
  }, [page]);

  return (
    <div className="jobs-cards-container ">
      {fetchState === apiStates.LOADING && !createdJobs.length ? (
        <div>Loading...</div>
      ) : (
        createdJobs.map((item) => (
          <div key={item._id} className="job-card">
            <h3 className="title">
              {item.companyName[lang] ||
                item.companyName.en ||
                item.companyName.ar}
            </h3>
            <h4 className="sub-title">
              {item.jobTitle[lang] || item.jobTitle.en || item.jobTitle.ar}
            </h4>
            <p className="body">
              <span>
                {item.address[lang] || item.address.en || item.address.ar}
              </span>
              <span>{dayjs(item.publishDate).format("DD, MMM")}</span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
