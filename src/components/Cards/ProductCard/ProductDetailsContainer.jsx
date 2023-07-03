import { getLocalizedNumber, getLocalizedWord } from "helpers/lang";
import { Link } from "react-router-dom";

export function ProductDetailsContainer({ product }) {
  if (!product?._id) return null;
  return (
    <>
      <Link
        to={`/product/${product._id}`}
        className="product-title block !line-clamp-1 overflow-ellipsis !leading-6 rtl:!leading-5"
      >
        <p>{getLocalizedWord(product?.name)}</p>
      </Link>
      <p className="product-vendor !leading-6">
        {getLocalizedWord(product?.vendor?.name)}
      </p>
      <div className="product-price !flex-wrap max-w-full !leading-3 gap-1 !flex-col">
        <div className="current-price">
          <span className="number pe-1">
            {getLocalizedNumber(product.price, true)}
          </span>
        </div>
        <div className="origional-price pe-1 rtl:mt-2">
          <span className="number">
            {getLocalizedNumber(product.originalPrice, true)}
          </span>
        </div>
      </div>
    </>
  );
}
