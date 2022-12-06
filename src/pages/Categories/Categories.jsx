import React, { useEffect, useState } from "react";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import SearchArea from "../../components/SearchArea/SearchArea";
import useSearch from "../../helpers/search";
import clientServices from "../../services/clientServices";
import "./Categories.scss";
export default function Categories() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { renderedList, setQuery } = useSearch(
    clientServices.categoryQuery,
    categories
  );
  async function getCategoriesHandler() {
    setLoading(true);
    try {
      let { data } = await clientServices.listAllVendorCategories();
      setCategories(data.records);
      console.log(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  useEffect(() => {
    getCategoriesHandler();
  }, []);
  return (
    <div className="categories-page">
      <SearchArea onChange={(e) => setQuery(e.target.value)} />
      {loading ? (
        <LoadingSpinner />
      ) : renderedList.length > 0 ? (
        <div className="categories-cards-container">
          {renderedList.length > 0
            ? renderedList.map((category) => {
                return <CategoryCard key={category._id} category={category} />;
              })
            : null}
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
}
