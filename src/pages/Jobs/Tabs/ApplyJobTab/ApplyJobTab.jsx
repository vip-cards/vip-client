import Tabs from "../../../../components/Tabs/Tabs";
import ApplyJobCreateJob from "./ApplyJobCreateJob";
import ApplyJobHome from "./ApplyJobHome";
import ApplyJobViewCreatedJob from "./ApplyJobViewCreatedJob";

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
      panel: <ApplyJobViewCreatedJob />,
    },
  };

  return <Tabs tabs={tabs} />;
};

export default ApplyJobTab;
