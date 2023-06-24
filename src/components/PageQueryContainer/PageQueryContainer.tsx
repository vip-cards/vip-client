import Search from "components/Inputs/Search/Search";
import Pagination from "components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import clientServices from "services/clientServices";
import FilterGroup from "./FilterGroup";

const LIMIT = 9;
type TQueryParams = {
  page: number;
  limit: number;
  [key: string]: any;
};

type TPageQueryContainerProps = {
  itemsCount: number;

  queryParams: TQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<TQueryParams>>;

  initialFilters?: any;
  filter?: any;
  setFilter?: React.Dispatch<React.SetStateAction<any>>;

  withSideFilter?: boolean;

  listRenderFn: () => React.ReactNode;

  children?: React.ReactNode;
};

export default function PageQueryContainer({
  queryParams,
  setQueryParams,
  initialFilters,
  filter,
  setFilter,
  withSideFilter = true,
  listRenderFn,
  itemsCount,
  children,
}: TPageQueryContainerProps) {
  const { t } = useTranslation();
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
    if (filter?.[title]?.findIndex((item) => id === item) > -1) {
      const newArr = filter[title];
      newArr.splice(
        filter?.[title]?.findIndex((item) => id === item),
        1
      );
      if (setFilter) setFilter((f) => ({ ...f, [title]: [...newArr] }));
    } else {
      if (setFilter)
        setFilter((f) => ({ ...f, [title]: [...(f[title] ?? []), id] }));
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setQueryParams((prev) => ({
        ...prev,
        page: 1,
        limit: LIMIT,
        "name.en": undefined,
        "name.ar": undefined,
      }));
    } else {
      handleListSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useEffect(() => {
    setQueryParams((p) => ({ ...p, ...filter }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    setSearchQuery("");
    if (setFilter) setFilter(initialFilters);
    setQueryParams({ page: 1, limit: LIMIT, ...initialFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <Search setSearchQuery={setSearchQuery} onClick={handleListSearch} />
      <section className="flex flex-col p-2 sm:p-8 min-h-[80vh]">
        {children}
        <div className="flex flex-row gap-2 h-full max-h-screen max-md:gap-1 max-xs:gap-0">
          {withSideFilter && (
            <aside className="w-full max-w-[13rem] overflow-hidden overflow-y-auto max-md:max-w-[9rem] max-xs:max-w-[7rem] max-xs:[&_*]:!text-xs">
              <FilterGroup
                filter={filter}
                listApi={clientServices.listAllCategories}
                title={t("category")}
                onToggle={handleFilterToggle}
              />
            </aside>
          )}
          <main className="flex flex-row w-full h-full gap-8 flex-wrap max-h-[85vh] overflow-y-auto p-5 justify-around flex-grow overscroll-y-auto">
            {listRenderFn()}
          </main>
        </div>
        <Pagination
          count={totalPages}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
        />
      </section>
    </>
  );
}
