import Tabs from "../../../../components/Tabs/Tabs";
import ApplyJobCreateJob from "./ApplyJobCreateJob";
import ApplyJobHome from "./ApplyJobHome";

const ApplyJobTab = () => {
  const tabs = {
    home: {
      label: "Home",
      panel: <ApplyJobHome />,
    },

    createJob: {
      label: "Create Job",
      panel: <ApplyJobCreateJob />,
    },

    viewCreatedJob: {
      label: "View Created Job",
      panel: <ApplyJobHome id={localStorage.getItem("userId") ?? ""} />,
    },
  };

  return (
    <div className="page-wrapper app-card-shadow px-0 md:px-5 lg:px-8 py-8 m-8">
      <Tabs tabs={tabs} />
    </div>
  );
};

export default ApplyJobTab;
