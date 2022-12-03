import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Axios from "../../services/Axios";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import OrderCard from "../../components/OrderCard/OrderCard";

import "./AccountOrders.scss";
import clientServices from "../../services/clientServices";

export default function AccountOrders() {
  const userId = useSelector((state) => state.auth.userId);
  const [orederList, setOrderList] = useState([]);
  useEffect(() => {
    clientServices.listClientOrders
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
        <h1 className="orders-title">Orders</h1>
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
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </>
  );
}
