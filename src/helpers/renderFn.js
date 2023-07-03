import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import NoData from "components/NoData/NoData";

export const listRenderFn = ({ isLoading, list, render }) => {
  if (isLoading) return <LoadingSpinner />;

  if (!list?.length) return <NoData />;

  return list.map(render);
};
