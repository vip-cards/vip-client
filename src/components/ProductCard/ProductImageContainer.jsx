import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { addWishProduct, removeWishProduct } from "../../store/wishlist-slice";
import WishIcon from "../WishIcon/WishIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faStopwatch } from "@fortawesome/free-solid-svg-icons";

export function ProductImageContainer({ product }) {
  const wishlistIds = useSelector((state) => state.wishlist.ids);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const swiperRef = useRef(null);

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

  console.log(product);
  console.log(wishlistIds.findIndex((item) => item === product._id) > -1);
  return (
    <Swiper
      ref={swiperRef}
      loop={true}
      autoplay={{ delay: 5000 }}
      spaceBetween={10}
      className="product-img-container pointer"
    >
      {product.image.map((image, index) => (
        <SwiperSlide key={image?.Location ?? index}>
          <img
            src={image?.Location ?? ""}
            alt="product-img"
            className="product-img"
            onClick={() => navigate("/product/" + product._id)}
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
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
