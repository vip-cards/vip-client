import classNames from "classnames";
import PostCard from "components/Cards/PostCard/PostCard";
import {
  PageQueryWrapper,
  SearchBar,
  SearchProvider,
} from "components/PageQueryContainer/PageQueryContext";
import { getLocalizedWord } from "helpers/lang";
import { listRenderFn } from "helpers/renderFn";
import { t } from "i18next";
import { useLayoutEffect, useState } from "react";
import clientServices from "services/clientServices";
import useSWR from "swr";

const LIMIT = 5;
const initialFilters = { "category._id": null };

export default function ApplyJobHome({ id = undefined }) {
  const initialQueryParams = {
    page: 1,
    limit: LIMIT,
    client: id,
  };
  const [queryParams, setQueryParams] = useState(initialQueryParams);
  const [filter, setFilter] = useState(initialFilters);
  const {
    data: jobsData,
    isLoading,
    mutate,
  } = useSWR([`view-${id ?? "all"}-posts`, queryParams], ([, queryParams]) =>
    clientServices.listAllPosts(queryParams)
  );
  const { data: categories } = useSWR("posts-categories", () =>
    clientServices
      .listAllCategories({ type: "job" })
      .then((data) => data.records)
  );

  const { records: jobs = undefined, counts = 0 } = jobsData ?? {};

  useLayoutEffect(() => {
    setFilter(initialFilters);
    if (id) setQueryParams((q) => ({ ...q, client: id }));
    else setQueryParams(initialQueryParams);
  }, [id]);

  return (
    <SearchProvider
      limit={LIMIT}
      itemsCount={counts}
      filter={filter}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
      listRenderFn={() =>
        listRenderFn({
          isLoading,
          list: jobs,
          render: (post) => {
            return <PostCard key={post._id} post={post} mutate={mutate} />;
          },
        })
      }
    >
      <div className="transition-all border-t-primary border-t-2">
        <SearchBar withSelector={true} types={["jobTitle", "name"]} />
      </div>
      <div className="flex flex-col h-full flex-grow mt-8">
        <aside className="flex flex-row flex-wrap gap-x-3 gap-y-2 justify-start items-start mb-2">
          <button
            onClick={() => {
              setFilter((f) => ({
                ...f,
                "category._id": null,
              }));
              setQueryParams(initialQueryParams);
            }}
            className={classNames("px-3 py-1 rounded-lg border text-sm", {
              "bg-primary/50 shadow-lg text-slate-800": !filter["category._id"],
              "bg-primary shadow text-black": filter["category._id"],
            })}
          >
            <>{t("reset")}</>
          </button>
          {categories?.map((category) => (
            <button
              onClick={() => {
                setFilter((f) => ({
                  ...f,
                  "category._id":
                    filter["category._id"] === category._id
                      ? null
                      : category._id,
                }));
                setQueryParams(initialQueryParams);
              }}
              key={category._id}
              className={classNames("px-3 py-1 rounded-lg border text-sm", {
                "bg-primary": filter["category._id"] === category._id,
                "bg-transparent group-hover:bg-primary/50":
                  filter["category._id"] !== category._id,
              })}
            >
              {getLocalizedWord(category.name)}
            </button>
          ))}
        </aside>{" "}
        <div className="jobs-cards-container ">
          <PageQueryWrapper />
        </div>
      </div>
    </SearchProvider>
  );
}
