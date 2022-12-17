import {
  faHeart,
  faMinus,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import i18n from "../../locales/i18n";
import "./CartProduct.scss";
export default function CartProduct({ item }) {
  const lang = i18n.language;
  const product = item.product;
  return (
    <div className="cart-product-container">
      <div className="cart-product-img-container">
        <img
          className="cart-product-img"
          src={product?.image?.Location}
          alt={product.name?.[lang]}
          loading="lazy"
        />
      </div>

      <h4 className="cart-product-title">{product.name?.[lang]}</h4>
      <p className="cart-product-description">{product.description?.[lang]}</p>
      <p className="cart-product-description">{product.description?.[lang]}</p>
      <div className="cart-product-actions">
        <span>
          <FontAwesomeIcon icon={faTrash} />
        </span>
        -
        <span>
          <FontAwesomeIcon icon={faHeart} />
        </span>
      </div>
      <div className="cart-product-qty">
        <span className="qty-action">
          <FontAwesomeIcon icon={faMinus} className="fa-xs" />
        </span>
        <span className="qty-value">{item.quantity}</span>
        <span className="qty-action">
          <FontAwesomeIcon icon={faPlus} className="fa-xs" />
        </span>
      </div>
      <div className="cart-product-total">{item.total} LE</div>
    </div>
  );
}
