import { useState, forwardRef } from "react";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import i18n from "../../locales/i18n";
import { useDispatch } from "react-redux";
import { addToCartThunk } from "../../store/cart-slice";

export const ProductActionsContainer = forwardRef(({ product }, ref) => {
  const lang = i18n.language;
  const dispatch = useDispatch();
  const [addToCartState, setAddToCartState] = useState({
    active: false,
    count: 1,
  });

  function cofirmAddToCartStateHandler(branchId) {
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
            <FontAwesomeIcon icon={faPlus} className="" />
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
          {product.branches?.map((branch) => {
            return (
              <div
                key={branch._id}
                className="branch-item"
                onClick={() => cofirmAddToCartStateHandler(branch._id)}
              >
                {branch.name[lang]}
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
});
