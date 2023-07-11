import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { addWishProduct, removeWishProduct } from "store/wishlist-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faShop,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import WishIcon from "components/WishIcon/WishIcon";
import { useTranslation } from "react-i18next";
import MainImage from "components/MainImage/MainImage";

export function ProductImageContainer({ product }) {
  const wishlistIds = useSelector((state) => state.wishlist.ids);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  const { t } = useTranslation();

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
  const renderImages = product?.image?.map((image, index) => (
    <SwiperSlide
      key={image?.Location ?? index}
      onClick={() => {
        navigate("/product/" + product._id);
      }}
    >
      <div className="product-img">
        <MainImage
          src={image?.Location ?? ""}
          alt="product-img"
          // className="product-img"
          onClick={() => navigate("/product/" + product._id)}
        />
      </div>
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
          <span style={{ fontSize: "0.7rem", fontWeight: 400 }}>
            {" "}
            {t("off")}
          </span>
        </span>
      )}
      {product.isLimited && (
        <div className="limited-icon">
          <span>
            <FontAwesomeIcon icon={faStopwatch} />
          </span>
          <span> {t("limited")}</span>
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
  ));
  if (!product?._id) return null;
  return (
    <Swiper
      ref={swiperRef}
      loop={true}
      autoplay={{ delay: 5000 }}
      spaceBetween={10}
      className="product-img-container pointer h-44"
    >
      {product.image.length ? (
        renderImages
      ) : (
        <SwiperSlide
          onClick={() => {
            navigate("/product/" + product._id);
          }}
        >
          <div className="flex flex-row justify-center items-center text-secondary/80 w-full h-full">
            <FontAwesomeIcon icon={faShop} size="4x" />
          </div>
        </SwiperSlide>
      )}
    </Swiper>
  );
}
