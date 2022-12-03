import { useEffect, useState } from "react";
import dayjs from "dayjs";
import clientServices from "../../services/clientServices";
import RatingStars from "../RatingStars/RatingStars";
import "./OrderCard.scss";

export default function OrderCard({ order }) {
  const [vendor, setVendor] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    clientServices
      .getVendor(order.vendor)
      .then((res) => res.data.record[0])
      .then((vendor) => setVendor(vendor));
  }, [order.vendor]);

  return (
    <article className="order-card">
      <div className="order-image-container">
        <img
          className="order-image"
          src={vendor.image.Location}
          alt={vendor.name.en}
          loading="lazy"
        />
      </div>

      <div className="order-vendor-name">
        <span>{vendor.name.en}</span>
        <RatingStars rate={vendor.rate} />
      </div>

      <div className="order-status">
        <span className={order.status.toLowerCase() || ""}>{order.status}</span>
      </div>

      <div className="order-date">
        {dayjs(order.purchaseDate).format("DD/MM/YYYY")}
      </div>

      <div className="order-points">
        <span className="number">{order.points}</span> &nbsp;
        <span className="text">points</span>
      </div>

      {/* <div className="order-money">money saved</div> */}
    </article>
  );
}
