import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faCircleNotch, faStopwatch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addWishProduct, removeWishProduct } from "../../store/wishlist-slice";
import WishIcon from "../WishIcon/WishIcon";
import { Link, useNavigate } from "react-router-dom";

export function ProductImageContainer({ product }) {
  const wishlistIds = useSelector((state) => state.wishlist.ids);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function toggleWishlist() {
    setDisabled(true);

    if (wishlistIds.includes(product._id)) {
      dispatch(removeWishProduct(product._id)).then(() => {
        setTimeout(() => {
          setDisabled(false);
        }, 900);
      });
    } else {
      dispatch(addWishProduct(product._id)).then(() => {
        setTimeout(() => {
          setDisabled(false);
        }, 900);
      });
    }
  }
  return (
    <div
      className="product-img-container pointer"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <img
        src={`${
          product?.image?.[0]?.Location ?? product?.image?.[0]?.url ?? ""
        }`}
        alt="product-img"
        className="product-img"
      />
      {!!(product.originalPrice - product.price) && (
        <span className="offer-icon">
          <span>
            {parseInt(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )}
            %
          </span>
          <span style={{ fontSize: "0.7rem", fontWeight: 400 }}> OFF</span>
        </span>
      )}
      {product.isLimited && (
        <div className="limited-icon">
          <span>
            <FontAwesomeIcon icon={faStopwatch} />
          </span>
          <span> limited</span>
        </div>
      )}
      <span
        className={`add-to-wishlist ${disabled ? "disabled" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist();
        }}
      >
        {disabled ? (
          <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
        ) : (
          <WishIcon
            wished={wishlistIds.includes(product._id)}
            disabled={disabled}
          />
        )}
      </span>
    </div>
  );
}
