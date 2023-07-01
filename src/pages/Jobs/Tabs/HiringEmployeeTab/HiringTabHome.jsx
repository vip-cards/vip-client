import PostCard from "components/Cards/PostCard/PostCard";
import {
  PageQueryWrapper,
  SearchBar,
  SearchProvider,
} from "components/PageQueryContainer/PageQueryContext";
import { listRenderFn } from "helpers/renderFn";
import { useLayoutEffect, useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";

const LIMIT = 5;
const initialQuery = {
  page: 1,
  limit: LIMIT,
};
export default function ApplyJobHome({ id = undefined }) {
  const [queryParams, setQueryParams] = useState(initialQuery);
  const { data: jobsData, isLoading } = useSWR(
    [`view-${id ?? "all"}-posts`, queryParams],
    ([, queryParams]) => clientServices.listAllPosts(queryParams)
  );

  const { records: jobs = undefined, counts = 0 } = jobsData ?? {};

  useLayoutEffect(() => {
    if (id) setQueryParams((q) => ({ ...q, client: id }));
    else setQueryParams(initialQuery);
  }, [id]);

  return (
    <SearchProvider
      limit={LIMIT}
      itemsCount={counts}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
      listRenderFn={() =>
        listRenderFn({
          isLoading,
          list: jobs,
          render: (post) => {
            return <PostCard key={post._id} post={post} />;
          },
        })
      }
    >
      <div className="transition-all border-t-primary border-t-2">
        <SearchBar withSelector={true} types={["jobTitle", "name"]} />
      </div>
      <div className="flex flex-col h-full flex-grow">
        <div className="jobs-cards-container ">
          <PageQueryWrapper />
        </div>
      </div>
    </SearchProvider>
  );
}
