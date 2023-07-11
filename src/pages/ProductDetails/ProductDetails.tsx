import {
  faCaretDown,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainButton } from "components/Buttons";
import FormErrorMessage from "components/FormErrorMessage/FormErrorMessage";
import { MainInput } from "components/Inputs";
import { withLoadingSkeleton } from "components/LoadingSkeleton/LoadingSkeleton";
import RatingStars from "components/RatingStars/RatingStars";
import { ROUTES } from "../../constants";
import { motion } from "framer-motion";
import { getInitialFormData } from "helpers/forms";
import { reviewForm, reviewSchema } from "helpers/forms/review";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import HomeSwiper from "pages/Home/HomeSwiper";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import clientServices from "services/clientServices";
import { selectAuth } from "store/auth-slice";
import { addToCartThunk, selectCartBranch } from "store/cart-slice";
import { addWishProduct } from "store/wishlist-slice";
import { SwiperSlide } from "swiper/react";
import useSWR from "swr";
import "./ProductDetails.scss";
import STOP_UGLY_CACHEING from "constants/configSWR";

const productReviewFetcher = ([key, id]) =>
  clientServices.getProductReview(id).then((res) => res.records as IReview[]);

const productFetcher = ([key, id]) =>
  clientServices.getProductDetails(id).then((data) => data.record[0]);

function ProductDetails(props) {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { t, i18n } = useTranslation();

  const auth = useSelector(selectAuth);
  const cartBranch = useSelector(selectCartBranch);

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [cart, setCart] = useState({ quantity: 0, branchId: -1 });
  const [reviewFormExpand, setReviewFormExpand] = useState(false);
  const [review, setReview] = useState(getInitialFormData(reviewForm));

  const lang = i18n.language;

  const { data: product, isLoading: isProductLoading } = useSWR(
    ["product", productId],
    productFetcher,
    STOP_UGLY_CACHEING
  );
  const { data: reviews = [] } = useSWR(
    ["product-rev", productId],
    productReviewFetcher,
    STOP_UGLY_CACHEING
  );

  async function addToCartHandler() {
    if (auth.userId === "guest") {
      toastPopup.error(
        "You are not allowed to add to cart untill you are subscribed!"
      );
    }
    if (cartBranch?._id && cart.branchId !== cartBranch?._id) {
      toastPopup.error(t("onlyYourCartBaranch"));
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

  function handleReviewSubmit(e) {
    e.preventDefault();
    const { rating, review: _review } = review;
    const reviewData = {
      client: auth.userId,
      product: product._id,
      rating: +rating,
      review: _review,
      vendor: product.vendor._id,
      type: "product",
    };
    setErrorList([]);
    const { error } = reviewSchema.validate(reviewData);
    if (error) {
      setErrorList(error.details.map((err) => err.message));
      return;
    }
    clientServices
      .createProductReview({
        client: auth.userId,
        product: product._id,
        rating: +rating,
        review: _review,
        vendor: product.vendor._id,
        type: "product",
      })
      .then(() => {
        toastPopup.success("Review Added!");
      })
      .catch(responseErrorToast)
      .finally(() => {
        setReview(getInitialFormData(reviewForm));
        setReviewFormExpand(false);
      });
  }

  return (
    <div className="app-card-shadow !flex !flex-col product-details-page max-md:!m-0 max-md:!rounded-none">
      <div className="product-details-page max-xs:!m-0">
        {/* image */}
        {withLoadingSkeleton(
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
          </HomeSwiper>,
          isProductLoading || !product
        )}

        {/* details */}
        <div className="product-details-container">
          <div className="product-details">
            <h2 className="product-title text-2xl">{product?.name?.[lang]}</h2>
            <h5 className="product-title">
              <RatingStars rate={product?.rate ?? 0} /> (
              {getLocalizedNumber(reviews?.length)} {t("reviews")})
            </h5>
            <Link
              className="vendor-title text-primary hover:text-secondary hover:underline transition-all"
              to={`/${ROUTES.VENDORS}/${product?.vendor._id}`}
            >
              {product?.vendor?.name?.[lang]}
            </Link>

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
            className="cart-branch-select px-1 py-2 outline outline-1 outline-primary/75"
            name="branches"
            id="branches"
            onChange={(e) =>
              setCart((state) => ({ ...state, branchId: e.target.value }))
            }
            value={cart.branchId}
          >
            <option value="-1" disabled>
              {t("choose a branch")}
            </option>
            {product?.branches?.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {getLocalizedWord(branch?.name)}
              </option>
            ))}
          </select>
          <div className="cart-quantity">
            <span
              className="qty-action"
              onClick={() => {
                setQuantity((q) => {
                  if (q > 1) {
                    return --q;
                  } else {
                    return 1;
                  }
                });
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
              disabled={
                // auth.userId === "guest" ||
                // (cartBranch?._id && cart.branchId !== cartBranch?._id) ||
                // !quantity ||
                loading
              }
              type="button"
              className="add-to-cart-btn disabled:opacity-75 disabled:pointer-events-none"
              onClick={addToCartHandler}
            >
              {t("addToCart")}{" "}
            </button>
            <button
              type="button"
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
              {t("addToWishlist")}{" "}
            </button>
          </div>
        </div>
        {/* reviews */}
        {/* <div className="product-reviews-container">reviews</div> */}
      </div>
      <aside
        className="ring-1 ring-primary/30 rounded-lg z-50 bg-primary text-white font-semibold py-2 cursor-pointer min-w-fit mx-auto px-3"
        onClick={() => setReviewFormExpand((p) => !p)}
      >
        <div className="flex flex-row gap-3 flex-nowrap w-full justify-between items-center">
          <span>Write a review ?</span>
          <FontAwesomeIcon
            icon={faCaretDown}
            className={classNames("transition-transform", {
              "rotate-180": reviewFormExpand,
            })}
          />
        </div>
      </aside>
      <motion.section
        layout
        initial={{ height: "0px" }}
        animate={{
          height: reviewFormExpand ? "100%" : "0px",
          transition: {
            type: "spring",
            duration: 0.15,
            delayChildren: 0.1,
            staggerChildren: 0.1,
            stiffness: 95,
            damping: 15,
          },
        }}
        className={classNames(
          "overflow-hidden min-w-[80%] mx-auto border border-primary -mt-10 rounded-lg"
        )}
      >
        <div className="bg-white p-6 rounded-lg max-w-[50rem] mx-auto px-12 py-8">
          <h2 className="text-xl font-bold mb-4">Write a review</h2>
          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
            {reviewForm.map((formInput) => {
              return (
                <div className="mb-4" key={formInput.name}>
                  <MainInput
                    {...formInput}
                    state={review}
                    setState={setReview}
                  />
                </div>
              );
            })}
            <div className="mx-auto w-full">
              <FormErrorMessage errorList={errorList} />
            </div>
            <MainButton active={!loading} type="submit">
              {t("confirm")}
            </MainButton>
          </form>
        </div>
      </motion.section>

      <section className="shadow shadow-primary/50 rounded-md p-3 m-3 mt-8 lg:mx-16">
        <h4 className="capitalize border-b">{t("reviews")}</h4>
        {reviews.map((review) => (
          <div
            key={review._id}
            className="flex flex-col px-3 gap-3 border-b-[1px] border-b-slate-300 mb-3 pb-3 pt-5"
          >
            <div className="flex flex-row justify-between gap-3">
              <h5 className="capitalize">
                {getLocalizedWord(review.client.name)}
              </h5>
              <div className="inline-flex gap-2 flex-row">
                <span className="px-1">{review.product.rate.toFixed(2)}</span>
                <RatingStars rate={review.product.rate ?? 0} />
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
