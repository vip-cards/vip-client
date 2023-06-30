import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { IconButton, MainButton } from "components/Buttons";
import CartProduct from "components/CartProduct/CartProduct";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { flushCart } from "store/cart-slice";

export default function CartProductsList({ cart }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function flushCartHandler() {
    if (!cart._id) return;
    dispatch(flushCart(cart._id));
  }

  return (
    <div className="cart-details">
      <div className="w-full flex flex-row">
        <MainButton
          size="small"
          className="ml-auto !rounded-lg w-fit !h-8 flex ltr:flex-row rtl:flex-row-reverse justify-center items-center gap-2 !px-4 !py-2 !bg-red-700 !text-white"
          onClick={flushCartHandler}
        >
          <span>{t("clearCart")}</span>
          <IconButton icon={faTrashCan} />
        </MainButton>
      </div>
      {cart.products.map((item) => (
        <CartProduct
          key={item._id}
          item={{ ...item, branchId: cart.branch._id }}
        />
      ))}
    </div>
  );
}
