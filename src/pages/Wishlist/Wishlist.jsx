import CardContainer from "components/CardContainer/CardContainer";
import { ProductCard } from "components/Cards";
import { listRenderFn } from "helpers/rednerFn";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Wishlist() {
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
      <CardContainer title="whishlist">
        <div className="flex flex-row flex-wrap gap-3 justify-around items-center p-8">
          {[...Array.from({ length: 4 }, (v, i) => i + 1)]?.map((item) => (
            <div
              key={item}
              className="w-[250px] h-[350px] bg-primary/80 rounded-lg animate-pulse delay-75"
            ></div>
          ))}
        </div>
      </CardContainer>
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
    <CardContainer title="whishlist">
      <div className="flex flex-row flex-wrap gap-4 justify-around items-center p-8">
        {renderWishlist()}
      </div>
    </CardContainer>
  );
}
