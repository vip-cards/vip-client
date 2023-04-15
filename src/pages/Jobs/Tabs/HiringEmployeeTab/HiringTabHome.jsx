import PostCard from "components/Cards/PostCard/PostCard";
import Pagination from "components/Pagination/Pagination";
import { listRenderFn } from "helpers/rednerFn";
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
    [`view-${id}-posts`, queryParams],
    ([, queryParams]) => clientServices.listAllPosts(queryParams)
  );

  const { records: jobs = undefined, counts = 0 } = jobsData ?? {};
  const totalPages = Math.ceil(counts / LIMIT);

  useLayoutEffect(() => {
    if (id) setQueryParams((q) => ({ ...q, client: id }));
    else setQueryParams(initialQuery);
  }, [id]);

  return (
    <div className="flex flex-col h-full flex-grow">
      <div className="jobs-cards-container ">
        {listRenderFn({
          isLoading,
          list: jobs,
          render: (post) => {
            return <PostCard key={post._id} post={post} />;
          },
        })}
      </div>
      <Pagination
        count={totalPages}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
    </div>
  );
}
