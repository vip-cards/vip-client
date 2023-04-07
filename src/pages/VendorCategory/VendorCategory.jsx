import { useEffect } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import SearchArea from "../../components/SearchArea/SearchArea";
import useSearch from "../../helpers/search";
import clientServices from "../../services/clientServices";
import { ProductCard } from "components/Cards";

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
      {loading ? (
        <LoadingSpinner />
      ) : renderedList.length > 0 ? (
        <div className="products-container">
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
