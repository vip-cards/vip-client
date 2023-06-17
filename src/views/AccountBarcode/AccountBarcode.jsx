import React from "react";
import Barcode from "react-barcode";
import { useSelector } from "react-redux";
import "./AccountBarcode.scss";
import { useTranslation } from "react-i18next";

export default function AccountBarcode() {
  const userData = useSelector((state) => state.auth.userData);
  const { t } = useTranslation();

  return (
    <section className="flex flex-col w-full gap-5 divide-y">
      <div className="account-barcode">
        <h5 className="text-center mb-3">{t("scanByCashier")}</h5>
        <Barcode value={userData.barcode} />
      </div>
      <div className="text-center mt-3">
        <h6 className="font-semibold">{t("Code")}</h6>
        <pre className="text-2xl">{userData.barcode}</pre>
      </div>
    </section>
  );
}
