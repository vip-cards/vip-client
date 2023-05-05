import Search from "components/Inputs/Search/Search";
import { useEffect, useState } from "react";
import useSWR from "swr";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import clientServices from "../../services/clientServices";
import "./Categories.scss";
import { CategoryCard } from "components/Cards";
import { listRenderFn } from "helpers/rednerFn";
import PageQueryContainer from "components/PageQueryContainer/PageQueryContainer";

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

  const CategoriesRenderer = () =>
    listRenderFn({
      isLoading: cateogoriesLoading,
      list: categories ?? [],
      render: (category) => {
        return <CategoryCard key={category._id} category={category} />;
      },
    });

  useEffect(() => {
    if (!searchQuery) {
      setQueryParams({ page: 1, limit: LIMIT });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <PageQueryContainer
      withSideFilter={false}
      itemsCount={categoriesCount}
      listRenderFn={CategoriesRenderer}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
    ></PageQueryContainer>
  );
}
