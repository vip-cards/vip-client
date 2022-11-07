import { t } from "i18next";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import clientServices from "../../services/clientServices";
import Carousel from "../Carousel/Carousel";
import CategoryCard from "../CategoryCard/CategoryCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ProductCard from "../ProductCard/ProductCard";
import VendorCard from "../VendorCard/VendorCard";
import "./Home.scss";
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const navigate = useNavigate();

  async function getHomeDataHandler() {
    setLoading(true);
    try {
      let { data: allCategories } = await clientServices.listAllCategories();
      let { data: allVendors } = await clientServices.listAllVendors();
      let { data: allOffers } = await clientServices.listAllProductsOfType(
        false
      );
      let { data: allHotDeals } = await clientServices.listAllProductsOfType(
        true
      );

      setCategories(allCategories?.records);
      setVendors(allVendors?.records);
      setOffers(allOffers?.records);
      setHotDeals(allHotDeals?.records);

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    getHomeDataHandler();
  }, []);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="client-home">
      <div className="carousel-container">
        <div className="add-button-container">
          <button
            className="add-button"
            onClick={() => {
              navigate(`/categories`);
            }}
          >
            {t("showAllCategories")}
          </button>
        </div>
        <Carousel
          data={vendors}
          render={(props) => {
            return <CategoryCard category={props} />;
          }}
        />
      </div>

      <div className="carousel-container">
        <div className="add-button-container">
          <button
            className="add-button"
            onClick={() => {
              navigate(`/vendors`);
            }}
          >
            {t("showAllVendors")}
          </button>
        </div>
        <Carousel
          data={vendors}
          autoplay={false}
          render={(props) => {
            return <VendorCard vendor={props} />;
          }}
        />
      </div>
      <div className="carousel-container">
        <div className="add-button-container">
          <button
            className="add-button"
            onClick={() => {
              navigate(`/offers`);
            }}
          >
            {t("showAllOffers")}
          </button>
        </div>
        <Carousel
          data={offers}
          autoplay={false}
          render={(props) => {
            return <ProductCard product={props} />;
          }}
        />
      </div>
      <div className="carousel-container">
        <div className="add-button-container">
          <button
            className="add-button"
            onClick={() => {
              navigate(`/hot-deals`);
            }}
          >
            {t("showAllHotDeals")}
          </button>
        </div>
        <Carousel
          autoplay={false}
          data={hotDeals}
          render={(props) => {
            return <ProductCard product={props} />;
          }}
        />
      </div>
    </div>
  );
}
