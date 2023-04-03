import React, { useEffect, useState } from "react";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import NoData from "../../components/NoData/NoData";
import SearchArea from "../../components/SearchArea/SearchArea";
import useSearch from "../../helpers/search";
import clientServices from "../../services/clientServices";
import "./Categories.scss";
export default function Categories() {
  const [loading, setLoading] = useState("idle");
  const [categories, setCategories] = useState([]);
  const {
    loading: searching,
    renderedList,
    setQuery,
  } = useSearch(clientServices.categoryQuery, categories);

  async function getCategoriesHandler() {
    setLoading("loading");
    try {
      let { data } = await clientServices.listAllVendorCategories();
      setCategories(data.records);

      setLoading("done");
    } catch (e) {
      setLoading("done");
    }
  }

  useEffect(() => {
    getCategoriesHandler();
  }, []);

  const RenderedList = () => {
    if (renderedList.length > 0) {
      return (
        <div className="categories-cards-container">
          {renderedList.map((category) => {
            return <CategoryCard key={category._id} category={category} />;
          })}
        </div>
      );
    } else {
      return <NoData />;
    }
  };
  return (
    <div className="categories-page">
      <SearchArea
        onChange={(e) => setQuery(e.target.value)}
        loading={searching}
      />

      {loading === "loading" ? <LoadingSpinner /> : <RenderedList />}
    </div>
  );
}
