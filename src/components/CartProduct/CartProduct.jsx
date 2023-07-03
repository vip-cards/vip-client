import {
  faCircleNotch,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import placeholder from "assets/images/categoreyPlaceHolder.png";
import { getLocalizedNumber } from "helpers/lang";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import i18n from "../../locales/i18n";
import { addToCartThunk, removeFromCartThunk } from "../../store/cart-slice";
import { addWishProduct } from "../../store/wishlist-slice";

import "./CartProduct.scss";

export default function CartProduct({ item }) {
  const lang = i18n.language;
  const product = item.product;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cartLoading = useSelector((state) => state.cart.loading);

  function removeItemHandler(quantity) {
    if (!+quantity) quantity = 1;
    dispatch(removeFromCartThunk({ _id: product._id, quantity }));
  }

  function addItemHandler() {
    dispatch(
      addToCartThunk({
        _id: product._id,
        branchId: item.branchId,
        quantity: 1,
      })
    );
  }

  function moveToWishlistHandler() {
    dispatch(addWishProduct(product._id)).then(() => {
      removeItemHandler(+item.quantity);
    });
  }

  return (
    <div className="cart-product-container">
      <div className="cart-product-img-container">
        <img
          className="cart-product-img"
          src={product?.image?.[0]?.Location ?? placeholder}
          alt={product.name?.[lang]}
          loading="lazy"
        />
      </div>

      <h4 className="cart-product-title">{product.name?.[lang]}</h4>
      <p className="cart-product-description">{product.description?.[lang]}</p>
      <p className="cart-product-description">{product.description?.[lang]}</p>
      <div className="cart-product-actions">
        <span
          onClick={() => removeItemHandler(+item.quantity)}
          disabled={cartLoading}
        >
          {t("remove")}
        </span>
        &nbsp;-&nbsp;
        <span onClick={moveToWishlistHandler} disabled={cartLoading}>
          {t("moveToWishlist")}{" "}
        </span>
      </div>
      <div className="cart-product-qty">
        <span
          className={`qty-action ${cartLoading ? "disabled" : ""}`}
          onClick={() => cartLoading || removeItemHandler()}
        >
          {cartLoading ? (
            <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
          ) : (
            <FontAwesomeIcon icon={faMinus} className="fa-xs" />
          )}
        </span>
        <span className="qty-value">{getLocalizedNumber(item.quantity)}</span>
        <span
          className={`qty-action ${cartLoading ? "disabled" : ""}`}
          onClick={() => cartLoading || addItemHandler()}
        >
          {cartLoading ? (
            <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
          ) : (
            <FontAwesomeIcon icon={faPlus} className="fa-xs" />
          )}
        </span>
      </div>
      <div className="cart-product-price">
        {getLocalizedNumber(item.product.price, true)}
      </div>
      <div className="cart-product-total">
        {getLocalizedNumber(item.total, true)}
      </div>
    </div>
  );
}
