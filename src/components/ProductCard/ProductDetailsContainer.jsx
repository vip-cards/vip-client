import { Link } from "react-router-dom";
import i18n from "../../locales/i18n";

export function ProductDetailsContainer({ product }) {
  const lang = i18n.language;
  return (
    <>
      <Link to={`/product/${product._id}`} className="product-title">
        <p>{product?.name?.[lang]}</p>
      </Link>
      <p className="product-vendor">{product?.vendor?.name?.[lang]} </p>
      <div className="product-price">
        <div className="current-price">
          <span className="number">{product.price}</span>&nbsp;
          <span className="text">EGP</span>
        </div>
        <div className="origional-price">
          <span className="number">{product.originalPrice}</span>&nbsp;
          <span className="text">EGP</span>
        </div>
      </div>
    </>
  );
}
