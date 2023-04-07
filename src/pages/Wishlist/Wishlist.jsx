import { ProductCard } from "components/Cards";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const wishlist = useSelector((state) => state.wishlist.products);
  const [list, setList] = useState([]);

  useEffect(() => {
    const cleanedList = wishlist
      .filter((product) => product)
      .filter(
        (value, index, arr) =>
          index === arr.findIndex((item) => item._id === value._id)
      );
    setList(cleanedList);
  }, [wishlist]);

  if (!list?.length) {
    return <Link to="/">Shop for Products</Link>;
  }
  return (
    <main className="products-container app-card-shadow page-wrapper my-16">
      <h3 className="text-center text-primary my-8 border-b-gray-100 border-b-2">
        Wishlist
      </h3>
      <div className="flex flex-row flex-wrap gap-4 justify-around items-center p-8">
        {list.length &&
          list?.map(({ product }, idx) => (
            <ProductCard product={product} key={product._id} />
          ))}
      </div>
    </main>
  );
}
