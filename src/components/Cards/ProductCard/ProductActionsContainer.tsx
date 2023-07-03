import {
  faCircleNotch,
  faMinus,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk } from "store/cart-slice";
import { addWishProduct } from "store/wishlist-slice";

export const ProductActionsContainer = forwardRef<any, { product: IProduct }>(
  ({ product }, ref) => {
    const { t } = useTranslation();
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
      if (!!cartBranch && branchId !== cartBranch._id) {
        setError(true);
        return;
      }
      setPopupLoading(true);
      try {
        const result = await dispatch(
          addToCartThunk({
            _id: product._id,
            branchId,
            quantity: addToCartState.count,
          })
        ).unwrap();
      } finally {
        setPopupLoading(false);
        setActive(false);
      }
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
        <div
          className="branch-select-error"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <p>{t("onlyYourCartBaranch")}</p>
          <div className="branch-select-error-actions">
            <button className="action-cancel" onClick={() => setError(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            {wishlistIds.includes(product._id) ? (
              <div className="already-whishlisted">already in whishlist</div>
            ) : (
              <button
                className="whitespace-nowrap text-sm"
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
                {t("addToWishlist")}{" "}
              </button>
            )}
          </div>
        </div>
      );
    };

    return (
      <>
        <div
          className="product-actions"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className={`add-to-cart ${addToCartState.active ? "show-add" : ""}`}
          >
            <span
              className="add-field-minus"
              onClick={(e) => {
                addToCartState.count > 1 && changeCount("minus");
              }}
            >
              <FontAwesomeIcon icon={faMinus} className="fa-xs" />
            </span>
            <span className="add-field-input">
              {getLocalizedNumber(addToCartState.count)}
            </span>
            <span
              className="add-field-plus"
              onClick={() => changeCount("plus")}
            >
              <FontAwesomeIcon icon={faPlus} className="fa-xs" />
            </span>
          </div>
          <div className="add-buttons" onClick={() => setActive(true)}>
            <span className="whitespace-nowrap">{t("addToCart")}</span>
          </div>
        </div>
        {addToCartState.active ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
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
                      className={classNames("branch-item", {
                        disabled:
                          !!cartBranch && branch?._id !== cartBranch?._id,
                      })}
                      onClick={() => cofirmAddToCartStateHandler(branch?._id)}
                    >
                      {getLocalizedWord(branch.name)}
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
  }
);
