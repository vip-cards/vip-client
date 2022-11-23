import { t } from "i18next";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import clientServices from "../../services/clientServices";
import Carousel from "../../components/Carousel/Carousel";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ProductCard from "../../components/ProductCard/ProductCard";
import VendorCard from "../../components/VendorCard/VendorCard";
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
          extraLarge={4.5}
          midLarge={4}
          large={3.5}
          medium={3}
          largeSmall={2.5}
          midSmall={2}
          extraSmall={1.25}
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
          extraLarge={4.5}
          midLarge={4}
          large={3.5}
          medium={3}
          largeSmall={2.5}
          midSmall={2}
          extraSmall={1.25}
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
          extraLarge={4.5}
          midLarge={4}
          large={3.5}
          medium={3}
          largeSmall={2.5}
          midSmall={2}
          extraSmall={1.25}
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
          extraLarge={4.5}
          midLarge={4}
          large={3.5}
          medium={3}
          largeSmall={2.5}
          midSmall={2}
          extraSmall={1.25}
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
