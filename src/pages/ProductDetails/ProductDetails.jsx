import {
  faCaretDown,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { t } from "i18next";
import HomeSwiper from "pages/Home/HomeSwiper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { selectAuth } from "store/auth-slice";
import { SwiperSlide } from "swiper/react";
import RatingStars from "../../components/RatingStars/RatingStars";
import toastPopup from "../../helpers/toastPopup";
import i18n from "../../locales/i18n";
import clientServices from "../../services/clientServices";
import { addToCartThunk } from "../../store/cart-slice";
import { addWishProduct } from "../../store/wishlist-slice";
import useSWR from "swr";
import "./ProductDetails.scss";
import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import { getLocalizedWord } from "helpers/lang";

function ProductDetails(props) {
  const lang = i18n.language;
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({ quantity: 0, branchId: -1 });
  const cartBranch = useSelector((state) => state.cart.branch);
  const [review, setReview] = useState({});
  const [reviewFormExpand, setReviewFormExpand] = useState(false);

  const auth = useSelector(selectAuth);
  const { data } = useSWR(`product-${productId}`, () =>
    clientServices.getProductReview(productId)
  );
  const reviews = data?.records ?? [];

  async function fetchProductData() {
    try {
      const data = await clientServices.getProductDetails(productId);
      setProduct(data.record[0]);
    } catch (e) {}
  }

  async function addToCartHandler() {
    if (auth.userId === "guest") {
      toastPopup.error(
        "You are not allowed to add to cart untill you are subscribed!"
      );
    }
    if (cartBranch?._id && cart.branchId !== cartBranch?._id) {
      toastPopup.error("You can only choose the branch in your cart");
      return;
    }
    setLoading(true);
    const result = await dispatch(
      addToCartThunk({
        _id: product._id,
        quantity,
        branchId: cart.branchId,
      })
    ).unwrap();

    setLoading(true);
  }
  function addToWishlisthandler() {
    dispatch(addWishProduct(product._id));
  }
  const formDataList = [
    {
      name: "rating",
      type: "list",
      identifier: "name",
      list: [
        { name: { en: 1, ar: 1 } },
        { name: { en: 2, ar: 2 } },
        { name: { en: 3, ar: 3 } },
        { name: { en: 4, ar: 4 } },
        { name: { en: 5, ar: 5 } },
      ],
      required: false,
    },
    { name: "review", type: "textarea", required: false },
  ];

  function handleReviewSubmit(e) {
    e.preventDefault();

    clientServices
      .createProductReview({
        client: auth.userId,
        // vendor: product.vendor._id,
        product: product._id,
        rating: +review.rating,
        review: review.review,
        type: "product",
      })
      .then(() => {
        toastPopup.success("Review Added!");
      })
      .catch(() => {
        toastPopup.error("Something Went Wrong!");
      })
      .finally(() => {
        setReview({});
        setReviewFormExpand(false);
      });
  }

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <div className="app-card-shadow !flex !flex-col product-details-page">
      <div className="product-details-page">
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
            <h2 className="product-title text-2xl">{product?.name?.[lang]}</h2>
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
              {t("addToCart")}{" "}
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
      <aside
        className="ring-1 ring-primary/30 rounded-lg bg-primary/90 text-white font-semibold py-2 cursor-pointer min-w-[80%] mx-auto px-3"
        onClick={() => setReviewFormExpand((p) => !p)}
      >
        <div className="flex flex-row flwx-nowrap w-full justify-between items-center">
          <span>Write a review ?</span>
          <FontAwesomeIcon
            icon={faCaretDown}
            className={classNames("transition-transform", {
              "rotate-180": reviewFormExpand,
            })}
          />
        </div>
      </aside>
      <section
        className={classNames("px-8 overflow-hidden transition-all", {
          "h-0": !reviewFormExpand,
          "h-full": reviewFormExpand,
        })}
      >
        <div className="bg-white p-6 rounded-lg shadow-md max-w-[50rem] mx-auto px-12 py-8">
          <h2 className="text-xl font-bold mb-4">Write a review</h2>
          <form onClick={handleReviewSubmit} className="flex flex-col gap-4">
            {formDataList.map((formInput) => {
              return (
                <div className="mb-4" key={formInput.name}>
                  <MainInput
                    name={formInput.name}
                    type={formInput.type}
                    required={formInput.required}
                    list={formInput.list}
                    identifier={formInput.identifier}
                    state={review}
                    setState={setReview}
                    dateRange={formInput.dateRange}
                  />
                </div>
              );
            })}

            <MainButton type="submit">Submit</MainButton>
          </form>
        </div>
      </section>

      <section className="shadow shadow-primary/50 rounded-md p-3 m-3 lg:mx-16">
        <h1>reviews</h1>
        {reviews.map((review) => (
          <div
            key={review._id}
            className="flex flex-col px-3 gap-3 border-b-[1px] border-b-slate-300 mb-3 pb-3"
          >
            <div className="flex flex-row justify-between gap-3">
              <h3 className="capitalize">
                {getLocalizedWord(review.client.name)}
              </h3>
              <div>
                <RatingStars rate={review.rating ?? 0} />
              </div>
            </div>
            <div className="px-1">{review.review}</div>
          </div>
        ))}
      </section>
    </div>
  );
}

ProductDetails.propTypes = {};

export default ProductDetails;
