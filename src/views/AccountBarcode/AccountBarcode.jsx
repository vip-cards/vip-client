import React from "react";
import Barcode from "react-barcode";
import { useSelector } from "react-redux";
import "./AccountBarcode.scss";

export default function AccountBarcode() {
  const userData = useSelector((state) => state.auth.userData);
  return (
    <div className="account-barcode">
      <Barcode value={userData.barcode} />
    </div>
  );
}
