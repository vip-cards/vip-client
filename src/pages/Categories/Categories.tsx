import { CategoryCard } from "components/Cards";
import PageQueryContainer from "components/PageQueryContainer/PageQueryContainer";
import { listRenderFn } from "helpers/renderFn";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";
import clientServices from "../../services/clientServices";
import "./Categories.scss";

const LIMIT = 9;

export default function Categories() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("vendor");
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
    vendor: vendorId ?? null,
  });

  const { data: categoriesData, isLoading: cateogoriesLoading } = useSWR(
    ["vendor-categories", vendorId, queryParams],
    () =>
      clientServices.listAllCategories({
        ...queryParams,
        type: vendorId ? "product" : "vendor",
      })
  );

  const { records: categories = undefined, counts: categoriesCount } =
    categoriesData ?? {};

  useEffect(() => {
    setQueryParams((prev) => ({
      ...prev,
      "vendor._id": vendorId ? vendorId : null,
    }));
  }, [vendorId]);
  const CategoriesRenderer = () =>
    listRenderFn({
      isLoading: cateogoriesLoading,
      list: categories ?? [],
      render: (category: IProductCategory) => {
        return (
          <CategoryCard
            key={category._id}
            category={category}
            vendorId={vendorId}
          />
        );
      },
    });

  return (
    <PageQueryContainer
      withSideFilter={false}
      itemsCount={categoriesCount}
      listRenderFn={CategoriesRenderer}
      queryParams={queryParams}
      setQueryParams={setQueryParams}
    >
      <Helmet>
        <title>{t("categories")}</title>
      </Helmet>
    </PageQueryContainer>
  );
}
