import axios from "axios";
import store from "store";
import clientServices from "./clientServices";

class PaymobService {
  paymobAPI = "https://accept.paymob.com/api/";
  user = () => store.getState().auth.userData;

  convertToCents = (amount) => +(amount.toFixed(2) * 100);

  async getToken() {
    const { data } = await axios.post(this.paymobAPI + "auth/tokens", {
      api_key: process.env.REACT_APP_PAYMOB,
    });
    return data.token;
  }

  async orderPayment(
    amount,
    orderId = undefined,
    paymentEndPoint = undefined,
    isPremiumSubscribtion = false
  ) {
    const amount_cents = this.convertToCents(amount);
    const auth_token = await this.getToken();

    return axios
      .post(this.paymobAPI + "ecommerce/orders", {
        auth_token,
        delivery_needed: false,
        amount_cents,
        currency: "EGP",
        items: [],
        merchant_order_id: orderId,
      })
      .then(({ data }) => data);
  }

  async getPaymentToken(amount, paymentOrderId) {
    const amount_cents = this.convertToCents(amount);
    const auth_token = await this.getToken();
    const fetchWallet = await clientServices
      .getSetting("walletNumber")
      .then((res) => res.record);
    const user = this.user();

    return axios
      .post(this.paymobAPI + "acceptance/payment_keys", {
        auth_token,
        expiration: 3600,
        amount_cents,
        currency: "EGP",
        order_id: paymentOrderId,
        lock_order_when_paid: "false",

        billing_data: {
          first_name: user.name.en.split(" ")[0],
          last_name: user.name.en.split(" ")[1],
          email: user.email,
          phone_number: user.phone ?? fetchWallet ?? "NA",
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
  }

  getPaymentModalUrl(paymentToken) {
    return `${this.paymobAPI}acceptance/iframes/760110?payment_token=${paymentToken}`;
  }

  async paymobProcessURL(
    amount = 0,
    orderId = undefined,
    paymentEndPoint = undefined,
    isPremiumSubscribtion = false
  ) {
    const paymentOrder = await this.orderPayment(amount, orderId);
    const paymentToken = await this.getPaymentToken(amount, paymentOrder.id);

    return `${this.paymobAPI}acceptance/iframes/760110?payment_token=${paymentToken}`;
  }
}

export default Object.freeze(new PaymobService());
