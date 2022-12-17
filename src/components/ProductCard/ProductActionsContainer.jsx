import { useState, forwardRef } from "react";
import {
  faCircleNotch,
  faHeart,
  faMinus,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import i18n from "../../locales/i18n";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk } from "../../store/cart-slice";
import { addWishProduct } from "../../store/wishlist-slice";

export const ProductActionsContainer = forwardRef(({ product }, ref) => {
  const lang = i18n.language;
  const dispatch = useDispatch();
  const [addToCartState, setAddToCartState] = useState({
    active: false,
    count: 1,
    error: false,
  });

  const cartBranch = useSelector((state) => state.cart.branch);
  const wishlistIds = useSelector((state) => state.wishlist.ids);
  console.log(cartBranch);

  function cofirmAddToCartStateHandler(branchId) {
    console.log(branchId);
    console.log(cartBranch);
    if (branchId !== cartBranch._id) {
      setAddToCartState((state) => ({ ...state, error: true }));

      return;
    }
    dispatch(
      addToCartThunk({
        _id: product._id,
        branchId,
        quantity: addToCartState.count,
      })
    );
    console.log("added" + product._id, "--->count" + addToCartState.count);
    console.log(product);
    console.log(branchId);
    // setAddToCartState((state) => ({ ...state, count: 1, active: false }));
  }

  const BranchSelectPopup = () => {
    return (
      <div className="branch-select-error">
        <p>You can only choose the branch in your cart</p>
        <div className="branch-select-error-actions">
          <button
            className="action-cancel"
            onClick={() =>
              setAddToCartState((state) => ({ ...state, error: false }))
            }
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          {console.log(product._id)}
          {console.log(wishlistIds.includes(product._id))}
          {wishlistIds.includes(product._id) ? (
            <div className="already-whishlisted">already in whishlist</div>
          ) : (
            <button
              onClick={() => {
                dispatch(addWishProduct(product._id)).then(() => {
                  setTimeout(() => {}, 900);
                });
              }}
            >
              add to wishlist
            </button>
          )}
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="product-actions">
        <div
          className={`add-to-cart ${addToCartState.active ? "show-add" : ""}`}
        >
          <span
            className="add-field-minus"
            onClick={() => {
              if (addToCartState.count <= 1) return;
              setAddToCartState((state) => ({
                ...state,
                count: state.count - 1,
              }));
            }}
          >
            <FontAwesomeIcon icon={faMinus} className="fa-xs" />
          </span>
          <span className="add-field-input">{addToCartState.count}</span>
          <span
            className="add-field-plus"
            onClick={() => {
              setAddToCartState((state) => ({
                ...state,
                count: state.count + 1,
              }));
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="fa-xs" />
          </span>
        </div>
        <div
          className="add-buttons"
          onClick={() =>
            setAddToCartState((state) => ({ ...state, active: true }))
          }
        >
          <span>Add to cart</span>
        </div>
      </div>
      {addToCartState.active ? (
        <div
          className="branches-list"
          ref={ref}
          onAnimationEnd={(e) => {
            console.log(e);
            if (e.animationName === "branches-popup-close")
              setAddToCartState((state) => ({ ...state, active: false }));
          }}
        >
          <div className="loading-icon">

          <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
          </div>
          {product.branches?.map((branch) => {
            return (
              <div
                key={branch._id}
                className={`branch-item ${
                  branch._id !== cartBranch._id ? "disabled" : null
                }`}
                onClick={() => cofirmAddToCartStateHandler(branch._id)}
              >
                {branch.name[lang]}
              </div>
            );
          })}
        </div>
      ) : null}
      {addToCartState.active && addToCartState.error && <BranchSelectPopup />}{" "}
    </>
  );
});
