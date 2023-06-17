import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import { Link } from "react-router-dom";

export function ProductDetailsContainer({ product }) {
  if (!product?._id) return null;
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
          <span className="number px-1">
            {getLocalizedNumber(product.price, true)}
          </span>
        </div>
        <div className="origional-price px-1">
          <span className="number">
            {getLocalizedNumber(product.originalPrice, true)}
          </span>
        </div>
      </div>
    </>
  );
}
