import {
  faMinus,
  faPlus,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import RatingStars from "../../components/RatingStars/RatingStars";
import toastPopup from "../../helpers/toastPopup";
import i18n from "../../locales/i18n";
import clientServices from "../../services/clientServices";
import { addToCartThunk } from "../../store/cart-slice";
import { addWishProduct } from "../../store/wishlist-slice";
import "./ProductDetails.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import HomeSwiper from "pages/Home/HomeSwiper";
import { selectAuth } from "store/auth-slice";
import classNames from "classnames";

function ProductDetails(props) {
  const lang = i18n.language;
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({ quantity: 0, branchId: -1 });
  const cartBranch = useSelector((state) => state.cart.branch);
  const auth = useSelector(selectAuth);
  async function fetchProductData() {
    try {
      const { data } = await clientServices.getProductDetails(productId);
      setProduct(data.record[0]);
    } catch (e) {}
  }

  async function addToCartHandler() {
    if (auth.userId === "guest") {
      toastPopup.error(
        "You are not allowed to add to cart untill you are subscribe!"
      );
    }
    if (!cart.branchId || cart.branchId < 0) return;
    if (cart.branchId !== cartBranch?._id) {
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
      <HomeSwiper
        // ref={swiperRef}
        loop={true}
        autoplay={{ delay: 5000 }}
        spaceBetween={10}
        className="product-img-container max-h-60 pointer rounded-lg overflow-hidden max-w-full"
      >
        {product?.image?.map((image, index) => (
          <SwiperSlide key={image?.Location ?? index}>
            <img
              src={image?.Location ?? ""}
              alt="product-img"
              className="product-img"
            />
          </SwiperSlide>
        ))}
      </HomeSwiper>
      {/* details */}
      <div className="product-details-container">
        <div className="product-details">
          <h2 className="product-title">{product?.name?.[lang]}</h2>
          <h5 className="product-title">
            <RatingStars rate={product?.rate} />
          </h5>
          <h4 className="vendor-title">{product?.vendor?.name?.[lang]}</h4>

          <p>
            <span className="line-through text-slate-800">
              {product?.originalPrice} EGP
            </span>
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
          <button
            disabled={auth.userId === "guest"}
            className="add-to-cart-btn disabled:opacity-75 disabled:pointer-events-none"
            onClick={addToCartHandler}
          >
            Add to cart
          </button>
          <span
            disabled={auth.userId === "guest"}
            className={classNames(
              {
                "opacity-75": auth.userId === "guest",
                "pointer-events-none": auth.userId === "guest",
              },
              "add-to-wishlist-btn"
            )}
            onClick={addToWishlisthandler}
          >
            add to wishlist
          </span>
        </div>
      </div>
      {/* reviews */}
      {/* <div className="product-reviews-container">reviews</div> */}
    </div>
  );
}

ProductDetails.propTypes = {};

export default ProductDetails;
