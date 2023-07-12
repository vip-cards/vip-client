import CardContainer from "components/CardContainer/CardContainer";
import Tabs from "components/Tabs/Tabs";
import { HiringTabCreateJob, HiringTabHome } from "pages";

const HiringEmployeeTab = () => {
  let userId = localStorage.getItem("userId");
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
      panel: <HiringTabHome id={userId} />,
    },
  };

  return (
    <CardContainer className="" title="" withHeader={false}>
      <Tabs tabs={tabs} />
    </CardContainer>
  );
};

export default HiringEmployeeTab;
