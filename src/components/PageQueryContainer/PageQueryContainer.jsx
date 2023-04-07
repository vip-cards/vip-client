import { faRankingStar, faStreetView } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainButton } from "components/Buttons";
import Search from "components/Inputs/Search/Search";
import { getLocalizedWord } from "helpers/lang";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import clientServices from "services/clientServices";
import useSWRInfinite from "swr/infinite";

const LIMIT = 9;

export default function PageQueryContainer({
  queryParams,
  setQueryParams,
  initialFilters,
  filter,
  setFilter,
  withSideFilter = true,
  listRenderFn,
  itemsCount,
}) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const totalPages = Math.ceil(itemsCount / LIMIT);

  const handleListSearch = () => {
    if (!searchQuery) return;
    const arabicReg = /[\u0621-\u064A]/g;
    const isArabic = arabicReg.test(searchQuery);
    const queryObj = {
      ...(!isArabic && { "name.en": searchQuery }),
      ...(isArabic && { "name.ar": searchQuery }),
    };
    setQueryParams((prev) => ({ ...prev, page: 1, ...queryObj }));
  };

  const handleFilterToggle = (title, id) => {
    console.log(filter);
    if (filter?.[title]?.findIndex((item) => id === item) > -1) {
      const newArr = filter[title];
      newArr.splice(
        filter?.[title]?.findIndex((item) => id === item),
        1
      );
      setFilter((f) => ({ ...f, [title]: [...newArr] }));
    } else {
      setFilter((f) => ({ ...f, [title]: [...(f[title] ?? []), id] }));
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setQueryParams({ page: 1, limit: LIMIT });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    setQueryParams((p) => ({ ...p, ...filter }));
  }, [filter]);

  useEffect(() => {
    setSearchQuery("");
    setFilter(initialFilters);
    setQueryParams({ page: 1, limit: LIMIT, ...initialFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <Search
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        onClick={handleListSearch}
      />
      <section className="flex flex-col p-8 min-h-[80vh]">
        <header className="flex flex-row">
          <button>
            sort by rating <FontAwesomeIcon icon={faRankingStar} />
          </button>
          <button>
            sort by rating <FontAwesomeIcon icon={faStreetView} />
          </button>
        </header>
        <div className="flex flex-row gap-2 h-full max-h-screen">
          {withSideFilter && (
            <aside className="w-full max-w-[13rem] overflow-hidden overflow-y-auto">
              <FilterGroup
                filter={filter}
                listApi={clientServices.listAllCategories}
                title="category"
                onToggle={handleFilterToggle}
              />
            </aside>
          )}
          <main className="flex flex-row w-full h-full gap-8 flex-wrap max-h-[85vh] overflow-y-auto p-5 justify-around flex-grow">
            {listRenderFn()}
          </main>
        </div>
        <footer className="p-8 flex flex-row gap-3 justify-center items-center">
          <MainButton
            disabled={1 === queryParams.page}
            onClick={() =>
              setQueryParams((params) => ({
                ...params,
                page: params.page > 1 ? params.page - 1 : 1,
              }))
            }
            className="p-2 !rounded-full justify-center items-center flex aspect-square disabled:bg-primary/50"
            size="small"
          >
            {"<"}
          </MainButton>
          {[...Array.from({ length: totalPages }, (v, i) => i + 1)]?.map(
            (item) => (
              <MainButton
                disabled={item === queryParams.page}
                onClick={() =>
                  setQueryParams((params) => ({ ...params, page: item }))
                }
                className={classNames(
                  {
                    "!bg-primary/50": item !== queryParams.page,
                  },
                  "p-2 !rounded-full justify-center items-center flex aspect-square"
                )}
                size="small"
              >
                {item}
              </MainButton>
            )
          )}
          <MainButton
            disabled={totalPages === queryParams.page}
            onClick={() =>
              setQueryParams((params) => ({
                ...params,
                page: params.page < totalPages ? params.page + 1 : totalPages,
              }))
            }
            className="p-2 !rounded-full justify-center items-center flex aspect-square disabled:bg-primary/50"
            size="small"
          >
            {">"}
          </MainButton>
        </footer>
      </section>
    </>
  );
}

const FilterToggle = ({ name = "filter", onToggle, selected = false, id }) => {
  const handleFilterToggle = () => {
    onToggle(id);
  };

  return (
    <button
      className="group  max-w-full flex flex-row w-full flex-nowrap justify-between items-center my-1 px-2 border-b-[1px] border-slate-400"
      onClick={handleFilterToggle}
    >
      <p className="text-lg whitespace-nowrap max-w-[8rem] text-ellipsis overflow-hidden">
        {name}
      </p>
      <div
        className={classNames(
          "aspect-square w-4 h-4 rounded-full border-2 border-black",
          {
            "bg-primary": selected,
            "bg-transparent group-hover:bg-primary/50": !selected,
          }
        )}
      ></div>
    </button>
  );
};

const FilterGroup = ({ title, filter, onToggle, listApi }) => {
  const LIMIT = 5;
  const {
    data: listData,
    size,
    setSize,
    mutate,
    isLoading,
    isValidating,
  } = useSWRInfinite(
    (index) => [`all-${title}s`, index + 1],
    ([, page]) => listApi({ type: "vendor", page, limit: LIMIT })
  );
  const list = listData ? listData.flatMap((arr) => arr.records) : [];
  const totalItems = listData ? listData?.[0].counts : 0;

  const group = filter?.[title];
  const totalPages = Math.floor(totalItems / LIMIT);
  console.log(group);
  console.log(filter);

  function handleLoadMore() {
    setSize(size + 1);
  }
  console.log(list);

  return (
    <div className="py-5 px-1 max-w-full">
      <h6 className="font-semibold capitalize">{title}</h6>
      {!!list?.length &&
        list?.map((item) => (
          <FilterToggle
            key={item._id + "-filter-item-" + title}
            onToggle={(id) => onToggle(title, id)}
            selected={group?.findIndex((q) => q === item._id) > -1}
            name={getLocalizedWord(item.name)}
            id={item._id}
          />
        ))}
      {!!list?.length && list.length < totalItems && (
        <div className="flex justify-center">
          <button
            className="border-2 border-gray-400 px-3 py-1 rounded-md mx-1"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
