import { useEffect, useState } from "react";
import dayjs from "dayjs";

import "./OrderCard.scss";
import clientServices from "services/clientServices";
import RatingStars from "components/RatingStars/RatingStars";
import { getLocalizedWord } from "helpers/lang";

export default function OrderCard({ order }) {
  const [vendor, setVendor] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    clientServices
      .getVendor(order.vendor?._id)
      .then((res) => res.data.record[0])
      .then((vendor) => setVendor(vendor));
  }, [order.vendor]);

  return (
    <article className="order-card">
      <div className="order-image-container">
        <img
          className="order-image bg-primary/60 min-h-full object-cover"
          src={vendor?.image?.Location}
          alt={getLocalizedWord(vendor?.name)}
          loading="lazy"
        />
      </div>

      <div className="order-vendor-name">
        <span>{getLocalizedWord(vendor?.name) || "Vendor name"}</span>
        <RatingStars rate={vendor?.rate ?? 0} />
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
