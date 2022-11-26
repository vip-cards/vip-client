import React, { useEffect, useState } from "react";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import SearchArea from "../../components/SearchArea/SearchArea";
import clientServices from "../../services/clientServices";
import "./Categories.scss";
export default function Categories() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

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
      <SearchArea />
      {loading ? (
        <LoadingSpinner />
      ) : categories.length > 0 ? (
        <div className="categories-cards-container">
          {categories.length > 0
            ? categories.map((category) => {
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
