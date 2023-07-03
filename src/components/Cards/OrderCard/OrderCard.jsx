import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import RatingStars from "components/RatingStars/RatingStars";
import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { useEffect, useState } from "react";
import clientServices from "services/clientServices";
import "./OrderCard.scss";
import OrderDetailsModal from "components/Modals/OrderDetailsModal";

export default function OrderCard({ order }) {
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
  const [vendor, setVendor] = useState({
    name: "",
    image: "",
  });

  function handleShowInfo() {
    setOrderDetailsVisible((p) => !p);
  }

  useEffect(() => {
    clientServices
      .getVendor(order.vendor?._id)
      .then((res) => res.data.record[0])
      .then((vendor) => setVendor(vendor));
  }, [order.vendor]);

  return (
    <div className="flex flex-col">
      <article className="order-card relative">
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
          <span className={order.status.toLowerCase() || ""}>
            {order.status}
          </span>
        </div>

        <div className="order-date">
          {dayjs(order.purchaseDate).format("DD/MM/YYYY")}
        </div>

        <div className="order-points">
          <span className="number">{order.points}</span> &nbsp;
          <span className="text">points</span>
        </div>

        <div className="absolute top-3 left-5">
          <button onClick={handleShowInfo}>
            <FontAwesomeIcon
              icon={faInfo}
              className="shadow-md hover:shadow hover:bg-primary transition-opacity text-white bg-primary/60 rounded-full p-1.5 aspect-square w-3 h-3"
            />
          </button>
        </div>
      </article>

      <OrderDetailsModal
        onClose={() => setOrderDetailsVisible(false)}
        activeModal={orderDetailsVisible}
        request={order}
        withAction={false}
      />
    </div>
  );
}
