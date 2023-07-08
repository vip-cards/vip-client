import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import dayjs from "dayjs";
import { getLocalizedWord } from "helpers/lang";
import { useState } from "react";
import "./OrderCard.scss";
import OrderDetailsModal from "components/Modals/OrderDetailsModal";

export default function OrderCard({ order }) {
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);

  function handleShowInfo() {
    setOrderDetailsVisible((p) => !p);
  }

  const vendor = order?.vendor;

  let orderTotalMoneySaved = order.shippingFees
    ? order.originalTotal - (order.total - order.shippingFees)
    : order.originalTotal - order.total;
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
        <div className="order-money">
          <span className="number">{Math.ceil(orderTotalMoneySaved)}</span>{" "}
          &nbsp;
          <span className="text">Money Saved</span>
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
