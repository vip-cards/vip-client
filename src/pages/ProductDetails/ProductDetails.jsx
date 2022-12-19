import React from "react";
import "./ProductDetails.scss";
import PropTypes from "prop-types";
import { useState } from "react";
import { useEffect } from "react";
import clientServices from "../../services/clientServices";
import { useParams } from "react-router";
import i18n from "../../locales/i18n";
import RatingStars from "../../components/RatingStars/RatingStars";

function ProductDetails(props) {
  const lang = i18n.language;
  const { productId } = useParams();
  const [product, setProduct] = useState({});

  async function fetchProductData() {
    try {
      const { data } = await clientServices.getProductDetails(productId);
      setProduct(data.record[0]);
    } catch (e) {}
  }
  console.log(product);
  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <div className="app-card-shadow product-details-page">
      <div className="product-image-container">
        <img src={product?.image?.Location} alt="f" className="product-image" />
      </div>
      <div className="product-details-container">
        <div className="product-details">
          <h2 className="product-title">{product?.name?.[lang]}</h2>
          <h4 className="vendor-title">{product?.vendor?.name?.[lang]}</h4>
          <span>
            <RatingStars rate={product?.rate} />
          </span>
          <p>
            <span>{product?.originalPrice} EGP</span>
            &nbsp;
            <span>{product?.price} EGP</span>
          </p>
          <p>{product?.description?.[lang]}</p>
        </div>
        <form className="product-cart">
          <select className="cart-branch-select" name="branches" id="branches">
            <option value="" disabled selected>
              choose a branch
            </option>
            {product?.branches?.map((branch) => (
              <option key={branch._id}>{branch?.name?.[lang]}</option>
            ))}
          </select>
          <div className="cart-quantity">
            <span>-</span>
            <span>123</span>
            <span>+</span>
          </div>
          <button className="add-to-cart-btn">Add to cart</button>
        </form>
      </div>
      <div className="product-reviews-container">reviews</div>
    </div>
  );
}

ProductDetails.propTypes = {};

export default ProductDetails;
