import {
  faCircleNotch,
  faMinus,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import i18n from "locales/i18n";
import { forwardRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk } from "store/cart-slice";
import { addWishProduct } from "store/wishlist-slice";

export const ProductActionsContainer = forwardRef(({ product }, ref) => {
  const lang = i18n.language;
  const dispatch = useDispatch();
  const [popupLoading, setPopupLoading] = useState(false);
  const [addToCartState, setAddToCartState] = useState({
    active: false,
    count: 1,
    error: false,
  });
  const cartBranch = useSelector((state) => state.cart.branch);
  const wishlistIds = useSelector((state) => state.wishlist.ids);

  async function cofirmAddToCartStateHandler(branchId) {
    if (branchId !== cartBranch._id) {
      setError(true);
      return;
    }
    setPopupLoading(true);
    const result = await dispatch(
      addToCartThunk({
        _id: product._id,
        branchId,
        quantity: addToCartState.count,
      })
    ).unwrap();
    setPopupLoading(false);
    setActive(false);
  }

  const setError = (check) => {
    setAddToCartState((state) => ({ ...state, error: !!check }));
  };
  const setActive = (check) => {
    setAddToCartState((state) => ({ ...state, active: !!check }));
  };
  const changeCount = (fn) => {
    setAddToCartState((state) => {
      let newCount = 0;
      if (fn === "plus") {
        newCount = state.count + 1;
      } else if (fn === "minus") {
        newCount = state.count - 1;
      }
      return {
        ...state,
        count: newCount,
      };
    });
  };
  const BranchSelectPopup = () => {
    return (
      <div className="branch-select-error">
        <p>You can only choose the branch in your cart</p>
        <div className="branch-select-error-actions">
          <button className="action-cancel" onClick={() => setError(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          {wishlistIds.includes(product._id) ? (
            <div className="already-whishlisted">already in whishlist</div>
          ) : (
            <button
              onClick={() => {
                setPopupLoading(true);
                dispatch(addWishProduct(product._id))
                  .unwrap()
                  .then(() => {
                    setAddToCartState((state) => ({
                      ...state,
                      active: false,
                      error: false,
                    }));
                    setPopupLoading(false);
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
            onClick={() => addToCartState.count > 1 && changeCount("minus")}
          >
            <FontAwesomeIcon icon={faMinus} className="fa-xs" />
          </span>
          <span className="add-field-input">{addToCartState.count}</span>
          <span className="add-field-plus" onClick={() => changeCount("plus")}>
            <FontAwesomeIcon icon={faPlus} className="fa-xs" />
          </span>
        </div>
        <div className="add-buttons" onClick={() => setActive(true)}>
          <span>Add to cart</span>
        </div>
      </div>
      {addToCartState.active ? (
        <div
          className="branches-list"
          ref={ref}
          onAnimationEnd={(e) => {
            if (e.animationName === "branches-popup-close") setActive(false);
          }}
        >
          {popupLoading ? (
            <div className="loading-icon">
              <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      ) : null}
      {addToCartState.active && addToCartState.error && <BranchSelectPopup />}
    </>
  );
});
