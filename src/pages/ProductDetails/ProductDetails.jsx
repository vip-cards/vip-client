import React, { useState, useEffect } from "react";
import "./ProductDetails.scss";
import clientServices from "../../services/clientServices";
import { useParams } from "react-router";
import i18n from "../../locales/i18n";
import RatingStars from "../../components/RatingStars/RatingStars";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk } from "../../store/cart-slice";
import { toast } from "react-toastify";
import toastPopup from "../../helpers/toastPopup";
import { addWishProduct } from "../../store/wishlist-slice";

function ProductDetails(props) {
  const lang = i18n.language;
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({ quantity: 0, branchId: -1 });
  const cartBranch = useSelector((state) => state.cart.branch);

  async function fetchProductData() {
    try {
      const { data } = await clientServices.getProductDetails(productId);
      setProduct(data.record[0]);
      console.log(data.record[0]);
    } catch (e) {}
  }

  async function addToCartHandler() {
    console.log(cart.branchId);
    if (!cart.branchId || cart.branchId < 0) return;
    if (cart.branchId !== cartBranch._id) {
      toastPopup.error("You can only choose the branch in your cart");
      return;
    }
    setLoading(true);
    const result = await dispatch(
      addToCartThunk({
        _id: product._id,
        ...cart,
      })
    ).unwrap();

    setLoading(true);
  }
  async function addToWishlisthandler() {
    dispatch(addWishProduct(product._id)).then(() => {
      setTimeout(() => {
        // setDisabled(false);
      }, 900);
    });
  }
  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <div className="app-card-shadow product-details-page">
      {/* image */}
      <div className="product-image-container">
        <img src={product?.image?.Location} alt="f" className="product-image" />
      </div>
      {/* details */}
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
      </div>
      {/* cart */}
      <div className="product-cart">
        <select
          className="cart-branch-select"
          name="branches"
          id="branches"
          onChange={(e) =>
            setCart((state) => ({ ...state, branchId: e.target.value }))
          }
          value={cart.branchId}
        >
          <option value="-1" disabled>
            choose a branch
          </option>
          {product?.branches?.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch?.name?.[lang]}
            </option>
          ))}
        </select>
        <div className="cart-quantity">
          <span
            className="qty-action"
            onClick={() => {
              setQuantity((q) => --q);
            }}
          >
            <FontAwesomeIcon icon={faMinus} className="fa-xs" />
          </span>
          <span className="qty-value">{quantity}</span>
          <span
            className="qty-action"
            onClick={() => {
              setQuantity((q) => ++q);
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="fa-xs" />
          </span>
        </div>
        <div className="cart-actions">
          <button className="add-to-cart-btn" onClick={addToCartHandler}>
            Add to cart
          </button>
          <span className="add-to-wishlist-btn" onClick={addToWishlisthandler}>
            add to wishlist
          </span>
        </div>
      </div>
      {/* reviews */}
      <div className="product-reviews-container">reviews</div>
    </div>
  );
}

ProductDetails.propTypes = {};

export default ProductDetails;
