import CardContainer from "components/CardContainer/CardContainer";
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
    <CardContainer title="whishlist">
      <div className="flex flex-row flex-wrap gap-4 justify-around items-center p-8">
        {list.length &&
          list?.map(({ product }, idx) => (
            <ProductCard product={product} key={product._id} />
          ))}
      </div>
    </CardContainer>
  );
}
