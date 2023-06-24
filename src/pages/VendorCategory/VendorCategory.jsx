import BreadCrumb from "components/BreadCrumb/BreadCrumb";
import { ProductCard } from "components/Cards";
import { useEffect } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import SearchArea from "../../components/SearchArea/SearchArea";
import useSearch from "../../helpers/search";
import clientServices from "../../services/clientServices";

export default function VendorCategory() {
  const { vendorId, categoryId } = useParams();
  const { loading, renderedList, setQuery, setParams, setLoading } = useSearch(
    clientServices.searchProducts,
    []
  );

  useEffect(() => {
    setLoading(true);
    setParams({
      vendor: vendorId,
      category: categoryId,
    });
  }, []);

  return (
    <div className="vendor-category-page">
      <SearchArea onChange={(e) => setQuery(e.target.value)} />
      <BreadCrumb pathList={[{ title: "vendors", link: "/vendors" }]} />
      {loading ? (
        <div className="h-full w-full">
          <LoadingSpinner />
        </div>
      ) : renderedList.length > 0 ? (
        <div className="products-container p-8 max-xs:p-4 flex flex-row flex-wrap gap-8 max-xs:gap-4">
          {renderedList.length > 0
            ? renderedList.map((product) => {
                return <ProductCard key={product._id} product={product} />;
              })
            : null}
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
}
