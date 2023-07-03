import Tabs from "components/Tabs/Tabs";
import { HiringTabCreateJob, HiringTabHome } from "pages";

const HiringEmployeeTab = () => {
  const tabs = {
    home: {
      label: "Home",
      panel: <HiringTabHome />,
    },

    createJob: {
      label: "Create Post",
      panel: <HiringTabCreateJob />,
    },

    viewCreatedJob: {
      label: "View Created Posts",
      panel: <HiringTabHome id={localStorage.getItem("userId") ?? ""} />,
    },
  };

  return (
    <div className="page-wrapper app-card-shadow px-0 md:px-5 lg:px-8 py-8 m-8">
      <Tabs tabs={tabs} />
    </div>
  );
};

export default HiringEmployeeTab;
