import { useSelector } from "react-redux";
import ProductCard from "../../components/ProductCard/ProductCard";

export default function WishList() {
  const wishList = useSelector((state) => state.wishList.products)
    .filter((product) => product)
    .filter(
      (value, index, arr) =>
        index === arr.findIndex((item) => item._id === value._id)
    );

  console.log(wishList);
  return (
    <div className="products-container">
      {wishList.map((product, idx) => (
        <ProductCard product={product} key={product._id} />
      ))}
    </div>
  );
}
