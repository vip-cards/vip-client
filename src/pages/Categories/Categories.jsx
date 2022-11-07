import React, { useEffect, useState } from "react";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import SearchArea from "../../components/SearchArea/SearchArea";
import VendorCard from "../../components/VendorCard/VendorCard";
import clientServices from "../../services/clientServices";
import "./Categories.scss";
export default function Categories() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  async function getCategoriesHandler() {
    setLoading(true);
    try {
      let { data } = await clientServices.listAllCategories();
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
      ) : (
        <div className="categories-cards-container">
          {categories.length > 0
            ? categories.map((category) => {
                return <CategoryCard key={category._id} category={category} />;
              })
            : null}
        </div>
      )}
    </div>
  );
}
