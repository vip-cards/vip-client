import Search from "components/Inputs/Search/Search";
import Pagination from "components/Pagination/Pagination";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
// TODO: split all exports

// Define the type for the queryParams object
interface IQueryParams {
  page: number;
  limit: number;
  [key: string]: string | number | undefined;
}

// Define the type for the initialFilters object
interface IInitialFilters {
  [key: string]: string | undefined;
}

// Define the type for the SearchContext
interface ISearchContextType {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleListSearch: () => void;
  listRenderFn: () => React.ReactNode;
  totalPages: number;
  queryParams: IQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<IQueryParams>>;
}

// Define the type for the SearchProvider props
interface ISearchProviderProps {
  queryParams: IQueryParams;
  setQueryParams: React.Dispatch<React.SetStateAction<IQueryParams>>;
  initialFilters?: IInitialFilters;
  filter?: IInitialFilters;
  setFilter?: (filter: IInitialFilters) => void;
  withSideFilter?: boolean;
  listRenderFn: () => React.ReactNode;
  itemsCount: number;
  children: React.ReactNode;
  limit?: number;
}

// Define the type for the SearchBar component
interface ISearchBarProps {
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  onClick: () => void;
}

// Define the type for the PageQueryWrapper component
interface IPageQueryWrapperProps {
  children?: React.ReactNode;
}

const SearchContext = createContext<ISearchContextType>({
  searchQuery: "",
  setSearchQuery: () => {},
  handleListSearch: () => {},
  totalPages: 0,
  queryParams: { page: 1, limit: 0 },
  setQueryParams: () => {},
  listRenderFn: () => <></>,
});
// Create a custom hook to easily access the SearchContext values
function useSearch() {
  return useContext(SearchContext);
}

// Create a component to provide the SearchContext to its children
export function SearchProvider({
  queryParams,
  setQueryParams,
  initialFilters,
  filter,
  setFilter,
  withSideFilter = true,
  listRenderFn,
  itemsCount,
  children,
  limit: LIMIT = 100,
}: ISearchProviderProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [queryType, setQueryType] = useState<string>("name");
  const totalPages = Math.ceil(itemsCount / LIMIT);

  const handleListSearch = () => {
    if (!searchQuery) return;
    const arabicReg = /[\u0621-\u064A]/g;
    const isArabic = arabicReg.test(searchQuery);
    const queryObj = {
      ...(!isArabic && { [`${queryType}.en`]: searchQuery }),
      ...(isArabic && { [`${queryType}.ar`]: searchQuery }),
    };
    setQueryParams((prev) => ({ ...prev, page: 1, ...queryObj }));
  };

  useEffect(() => {
    if (queryParams.type) {
      setQueryType(queryParams.type.toString());
    } else {
      setQueryParams((prev) => ({
        ...prev,
        [`${queryType}.ar`]: undefined,
        [`${queryType}.en`]: undefined,
      }));
      setQueryType("name");
    }

    if (!searchQuery) {
      setQueryParams((prev) => ({
        ...prev,
        page: 1,
        limit: LIMIT,

        [`name.ar`]: undefined,
        [`name.en`]: undefined,

        [`${queryType}.ar`]: undefined,
        [`${queryType}.en`]: undefined,
      }));
    } else {
      handleListSearch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, queryParams.type]);

  // useEffect(() => {
  //   if (queryParams.type) {
  //     setQueryType(queryParams.type.toString());
  //   } else {
  //     setQueryParams((prev) => ({
  //       ...prev,
  //       [`${queryType}.ar`]: undefined,
  //       [`${queryType}.en`]: undefined,
  //     }));
  //     setQueryType("name");
  //   }
  // }, [queryParams.type]);

  useEffect(() => {
    setQueryParams((p) => ({ ...p, ...filter }));
  }, [filter]);

  useEffect(() => {
    setSearchQuery("");
    setFilter && setFilter(initialFilters);
    setQueryParams({ page: 1, limit: LIMIT, ...initialFilters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  // Pass the search query and update function as values to the SearchContext
  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        handleListSearch,
        listRenderFn,
        totalPages,
        queryParams,
        setQueryParams,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

// Use the useSearch hook in your SearchBar component to access the search query and update function
export function SearchBar({ withSelector = false, types = [] }) {
  const { queryParams, setSearchQuery, handleListSearch, setQueryParams } =
    useSearch();

  return (
    <Search
      types={types}
      onClick={handleListSearch}
      withSelector={withSelector}
      setSearchQuery={setSearchQuery}
      setQueryParams={setQueryParams}
    />
  );
}

// Use the useSearch hook in your SearchResults component to access the search query
export function PageQueryWrapper({ children }: IPageQueryWrapperProps) {
  const { listRenderFn, totalPages, queryParams, setQueryParams } = useSearch();

  // Render your search results based on the search query
  return (
    <section className="flex flex-col p-2 md:p-8 min-h-[80vh]">
      {children}
      <div className="flex flex-row h-full max-h-screen gap-2">
        <main className="flex flex-row w-full h-full gap-8 flex-wrap max-h-[85vh] overflow-y-auto p-5 justify-around flex-grow">
          {listRenderFn()}
        </main>
      </div>
      <Pagination
        count={totalPages}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
    </section>
  );
}
