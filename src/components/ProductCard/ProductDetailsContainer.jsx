import i18n from "../../locales/i18n";

export function ProductDetailsContainer({ product }) {
  const lang = i18n.language;
  return (
    <>
      <p className="product-title">{product.name[lang]} </p>
      <p className="product-vendor">{product.vendor.name[lang]} </p>
      <div className="product-price">
        <div className="current-price">
          <span className="number">50</span>&nbsp;
          <span className="text">EGP</span>
        </div>
        <div className="origional-price">
          <span className="number">50</span>&nbsp;
          <span className="text">EGP</span>
        </div>
      </div>
    </>
  );
}
