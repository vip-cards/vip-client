import { ProductCard } from "components/Cards";
import { listRenderFn } from "helpers/renderFn";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import "./AccountWishlist.scss";

export default function AccountWishlist() {
  const { products: wishlist, loading } = useSelector(
    (state) => state.wishlist
  );

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

  if (loading && !list?.length) {
    return (
      <div className="products-container wishlist-container p-8 gap-8 flex flex-row flex-wrap">
        {[...Array.from({ length: 2 }, (v, i) => i + 1)]?.map((item) => (
          <div
            key={item}
            className="w-[250px] h-[350px] bg-primary/80 rounded-lg animate-pulse delay-75"
          ></div>
        ))}
      </div>
    );
  }

  const renderWishlist = () =>
    listRenderFn({
      isLoading: loading && !list?.length,
      list,
      render: ({ product }, idx) => (
        <ProductCard product={product} key={product._id} />
      ),
    });

  return (
    <div className="products-container wishlist-container p-8 gap-8 flex flex-row flex-wrap justify-around">
      {renderWishlist()}
    </div>
  );
}
