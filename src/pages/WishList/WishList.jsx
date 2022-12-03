import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";

export default function WishList() {
  const wishList = useSelector((state) => state.wishList.products);
  const [list, setList] = useState([]);

  console.log(wishList);
  useEffect(() => {
    const cleanedList = wishList
      .filter((product) => product)
      .filter(
        (value, index, arr) =>
          index === arr.findIndex((item) => item._id === value._id)
      );
    setList(cleanedList);
  }, [wishList]);

  if (list.length < 1) {
    return <Link to="/">Shop for Products</Link>;
  }

  return (
    <div className="products-container">
      {list.map((product, idx) => (
        <ProductCard product={product} key={product._id} />
      ))}
    </div>
  );
}
