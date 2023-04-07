import Search from "components/Inputs/Search/Search";
import { useEffect, useState } from "react";
import useSWR from "swr";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import clientServices from "../../services/clientServices";
import "./Categories.scss";
import { CategoryCard } from "components/Cards";

const LIMIT = 9;

export default function Categories() {
  const [queryParams, setQueryParams] = useState({ page: 1, limit: LIMIT });

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: categoriesData,
    isLoading: cateogoriesLoading,
    isValidating,
  } = useSWR(["all-categories", queryParams], () =>
    clientServices.listAllCategories({ ...queryParams, type: "vendor" })
  );

  const { records: categories = undefined, counts: categoriesCount } =
    categoriesData ?? {};
  const totalPages = Math.ceil(categoriesCount / LIMIT);

  const RenderedList = () => {
    if (cateogoriesLoading) return <LoadingSpinner />;
    if (!categories.length) return <NoData />;

    return (
      <div className="categories-cards-container">
        {categories.map((category) => {
          return <CategoryCard key={category._id} category={category} />;
        })}
      </div>
    );
  };

  const handleCategorySearch = () => {
    if (!searchQuery) return;
    const arabicReg = /[\u0621-\u064A]/g;
    const isArabic = arabicReg.test(searchQuery);
    const queryObj = {
      ...(!isArabic && { "name.en": searchQuery }),
      ...(isArabic && { "name.ar": searchQuery }),
    };
    setQueryParams((prev) => ({ ...prev, page: 1, ...queryObj }));
  };

  useEffect(() => {
    if (!searchQuery) {
      setQueryParams({ page: 1, limit: LIMIT });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <div className="categories-page relative">
      {cateogoriesLoading && (
        <div className="w-full absolute h-3 bg-green-600 animate-pulse"></div>
      )}
      <Search
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        onClick={handleCategorySearch}
      />
      <RenderedList />
    </div>
  );
}
