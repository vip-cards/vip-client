import { getLocalizedWord } from "helpers/lang";
import i18n from "locales/i18n";
import { Link } from "react-router-dom";

export function ProductDetailsContainer({ product }) {
  const lang = i18n.language;
  return (
    <>
      <Link to={`/product/${product._id}`} className="product-title">
        <p>{getLocalizedWord(product?.name)}</p>
      </Link>
      <p className="product-vendor">
        {getLocalizedWord(product?.vendor?.name)}
      </p>
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
