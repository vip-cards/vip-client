import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import CartProduct from "../../components/CartProduct/CartProduct";
import i18n from "../../locales/i18n";
import store from "../../store";
import "./CartPage.scss";

export default function CartPage() {
  const userId = store.getState().auth.userId;
  const lang = i18n.language;

  const cart = useSelector((state) => state.cart);
  console.log(cart);
  if (!cart._id) {
    return <div>Loading</div>;
  }
  return (
    <main className="app-card-shadow cart-page">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <h2>{cart?.branch?.name?.[lang]}</h2>
      <div className="cart-container">
        <div className="cart-details">
          {cart.products.map((item) => (
            <CartProduct key={item._id} item={item} />
          ))}
        </div>

        <div className="cart-summary">
          <div className="checkout-summary">
            <h3 className="checkout-title">Checkout</h3>
            <h4 className="checkout-total-title">Total:</h4>
            <h5 className="total-price">{cart.price.current} LE</h5>
            <button className="checkout-btn">checkout</button>
          </div>
          <div className="checkout-more">
            <b className="vendor-title">Vendor</b>
            <p className="vendor-name">{cart.vendor.name?.[lang]}</p>
            <b className="branch-title">Branch</b>
            <p className="branch-name">{cart?.branch?.name?.[lang]}</p>
            <b className="original-price-title">Original price</b>
            <p className="original-price-value">{cart.price.original} LE</p>
            <b className="original-price-title">Discount</b>
            <p className="original-price-name">
              {cart.price.original - cart.price.current} LE
            </p>
            <b>Points</b>
            <p>{cart.points}</p>
          </div>
        </div>
      </div>

      <div></div>
    </main>
  );
}
