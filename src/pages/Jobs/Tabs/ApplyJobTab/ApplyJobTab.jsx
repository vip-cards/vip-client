import CardContainer from "components/CardContainer/CardContainer";
import Tabs from "../../../../components/Tabs/Tabs";
import ApplyJobCreateJob from "./ApplyJobCreateJob";
import ApplyJobHome from "./ApplyJobHome";

const ApplyJobTab = () => {
  let userId = localStorage.getItem("userId");
  const tabs = {
    home: {
      label: "home",
      panel: <ApplyJobHome />,
    },

    createJob: {
      label: "Create Job",
      panel: <ApplyJobCreateJob />,
    },

    viewCreatedJob: {
      label: "View Created Job",
      panel: <ApplyJobHome id={userId} />,
    },
  };

  return (
    <CardContainer className="" title="" withHeader={false}>
      <Tabs tabs={tabs} />
    </CardContainer>
  );
};

export default ApplyJobTab;
