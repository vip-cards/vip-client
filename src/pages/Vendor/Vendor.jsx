import { t } from "i18next";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import clientServices from "../../services/clientServices";
import Carousel from "../../components/Carousel/Carousel";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ProductCard from "../../components/ProductCard/ProductCard";
import VendorCard from "../../components/VendorCard/VendorCard";
import "./Vendor.scss";
import BranchCard from "../../components/BranchCard/BranchCard";
import NoData from "../../components/NoData/NoData";

export default function Vendor() {
  const params = useParams();
  const vendorId = params.vendorId;

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [offers, setOffers] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const navigate = useNavigate();

  async function getVendorDataHandler() {
    setLoading(true);
    try {
      let { data: allBranches } = await clientServices.listAllVendorBranches(
        vendorId
      );

      let { data: allOffers } = await clientServices.listAllVendorProducts(
        vendorId
      );

      setBranches(allBranches?.records);
      setOffers(allOffers?.records);

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  console.log("allBarnches", branches);
  useEffect(() => {
    getVendorDataHandler();
  }, []);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="client-vendor-home">
      {branches.length > 0 ? (
        <div className="carousel-container">
          <div className="add-button-container">
            <button
              className="add-button"
              onClick={() => {
                navigate(`/vendors/${vendorId}/branches`);
              }}
            >
              {t("showallBranches")}
            </button>
          </div>
          <Carousel
            data={branches}
            autoplay={false}
            extraLarge={3.25}
            midLarge={3}
            large={2.5}
            medium={2}
            largeSmall={1.75}
            midSmall={1.5}
            extraSmall={1}
            render={(props) => {
              return <BranchCard branch={props} />;
            }}
          />
        </div>
      ) : null}

      {offers.length > 0 ? (
        <div className="carousel-container">
          {/* <div className="add-button-container">
            <button
              className="add-button"
              onClick={() => {
                navigate(`/offers`);
              }}
            >
              {t("showAllOffers")}
            </button>
          </div> */}
          <div className="products-container">
            {offers.map((offer) => {
              return <ProductCard key={offer._id} product={offer} />;
            })}
          </div>

          {/* <Carousel
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
          /> */}
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
}
