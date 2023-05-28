import axios from "axios";
import Modal from "components/Modal/Modal";
import OrderRequestsTable from "pages/CartPage/OrderRequestsTable";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import clientServices from "services/clientServices";
import { selectUserData } from "store/auth-slice";
import useSWR from "swr";

const AccountOrderRequests = () => {
  const userData = useSelector(selectUserData);
  const [paymentModal, setPaymentModal] = useState({ open: false, url: "" });

  const { data: requestsData = {}, mutate } = useSWR("all-order-requests", () =>
    clientServices.getOrdersRequests()
  );
  const requests = requestsData?.records ?? [];

  async function handleOrderRequestProceed(orderId, amount) {
    const auth_token = await axios
      .post("https://accept.paymob.com/api/auth/tokens", {
        api_key:
          "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TnpreE1USTNMQ0p1WVcxbElqb2lhVzVwZEdsaGJDSjkuY0JyaXE3SWxpN3F6a2x1eEhnSUUwem9VVzN2UlBCMm13OE5RNDZQUGhfT0N1QzhzZl9ob1pja0tjNVlmSEJ5REE4Uk9IYk54ZWJXaG83ekFWZnZ4QVE=",
      })
      .then(({ data }) => data.token);

    const amount_cents = +(amount.toFixed(2) * 100);
    const paymentOrder = await axios
      .post("https://accept.paymob.com/api/ecommerce/orders", {
        auth_token,
        delivery_needed: false,
        amount_cents,
        currency: "EGP",
        items: [],
        merchant_order_id: orderId,
      })
      .then(({ data }) => data);

    const paymentToken = await axios
      .post("https://accept.paymob.com/api/acceptance/payment_keys", {
        auth_token,
        expiration: 3600,
        amount_cents,
        currency: "EGP",
        order_id: paymentOrder.id,
        lock_order_when_paid: "false",
        billing_data: {
          first_name: userData.name.en.split(" ")[0],
          last_name: userData.name.en.split(" ")[1],
          email: userData.email,
          phone_number: userData.phone,
          street: "NA",
          building: "NA",
          apartment: "NA",
          floor: "NA",
          shipping_method: "NA",
          postal_code: "NA",
          city: "NA",
          country: "NA",
          state: "NA",
        },
        integration_id: 3814034,
      })
      .then(({ data }) => data.token);

    setPaymentModal({
      open: true,
      url: `https://accept.paymob.com/api/acceptance/iframes/760110?payment_token=${paymentToken}`,
    });
  }

  return (
    <>
      <OrderRequestsTable
        requests={requests}
        handleOrderRequestProceed={handleOrderRequestProceed}
        refetch={mutate}
      />
      <Modal
        className="w-screen h-screen"
        visible={paymentModal.open}
        onClose={() => setPaymentModal({ open: false, url: "" })}
      >
        {paymentModal.url && (
          <iframe
            title="payment"
            src={paymentModal.url}
            width="100%"
            height="100%"
            frameBorder="0"
          ></iframe>
        )}
      </Modal>
    </>
  );
};

export default AccountOrderRequests;
