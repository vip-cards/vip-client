import { useState } from "react";
import { useEffect } from "react";
import OrderCard from "../../components/OrderCard/OrderCard";

import "./AccountOrders.scss";
import clientServices from "../../services/clientServices";
import { t } from "i18next";

export default function AccountOrders() {
  const [orederList, setOrderList] = useState([]);
  useEffect(() => {
    clientServices
      .listClientOrders()
      .then((res) => {
        return res.data.records;
      })
      .then((orders) => {
        setOrderList(orders);
      })
      .catch((error) => {});
  }, []);

  return (
    <>
      <header className="orders-header">
        <h1 className="orders-title">{t("orders")}</h1>
        <div className="orders-details">
          <p>
            <span> Total Points</span>
            &nbsp;
            <b>
              {orederList.reduce((accumulator, item) => {
                return accumulator + item.points;
              }, 0)}
            </b>
          </p>
        </div>
      </header>

      <div className="orders-container">
        {orederList.length > 0 ? (
          <>
            {orederList.map((order, idx) => {
              return <OrderCard key={order._id} order={order} />;
            })}
          </>
        ) : null}
      </div>
    </>
  );
}
