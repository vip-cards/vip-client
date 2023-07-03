import { MainButton } from "components/Buttons";
import { MainInput } from "components/Inputs";
import Modal from "components/Modal/Modal";
import toastPopup, { responseErrorToast } from "helpers/toastPopup";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import clientServices from "services/clientServices";
import { newOrderRequest } from "services/socket/order";
import { getCurrentCartThunk } from "store/cart-slice";

export default function OrderRequestModal({
  showModal,
  setShowModal,
  hasOnlinePayment,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState({});

  const formData = [
    { name: "flatNumber", type: "number", required: true },
    { name: "buildingNumber", type: "text", required: true },
    { name: "street", type: "teaxtarea", required: true },
    { name: "district", type: "text", required: true },
    { name: "city", type: "text", required: true },
    { name: "country", type: "text", required: true },
    { name: "specialMark", type: "text", required: true },
  ];

  function handleCheckout(e) {
    e.preventDefault();
    const { paymentMethod, contactPhone, pickup, ...rest } = userInfo;

    clientServices
      .cartOrderRequest({
        shippingAddress: { ...rest },
        contactPhone,
        paymentMethod,
        requestDate: new Date().toISOString(),
      })
      .then(({ record }) => {
        toastPopup.success("Your order is being requested");
        setShowModal(false);
        newOrderRequest(record._id);

        dispatch(getCurrentCartThunk());
      })
      .catch(responseErrorToast);
  }

  return (
    <Modal
      visible={showModal}
      title="orderRequest"
      className="min-w-[30vw] max-w-[400px]"
      onClose={() => setShowModal(false)}
    >
      <form onSubmit={handleCheckout}>
        <div className="max-h-[50vh] overflow-y-auto overflow-hidden py-3 my-5 px-3">
          <fieldset className="border border-1 rounded-md flex flex-col gap-5 p-3">
            <legend className="font-semibold px-1">{t("order")}</legend>
            <div className="flex flex-row">
              <MainInput
                name="paymentMethod"
                type="select"
                list={
                  hasOnlinePayment
                    ? [
                        { name: "cash on delivery", value: "cash on delivery" },
                        { name: "visa", value: "visa" },
                      ]
                    : [{ name: "cash on delivery", value: "cash on delivery" }]
                }
                identifier="name"
                state={userInfo}
                setState={setUserInfo}
              />
            </div>
          </fieldset>

          <fieldset className="border border-1 rounded-md flex flex-col gap-5 p-3 mt-8">
            <legend className="font-semibold px-1">{t("address")}</legend>
            {formData.map((formInput, index) => {
              return (
                <MainInput
                  key={formInput.name}
                  state={userInfo}
                  setState={setUserInfo}
                  {...formInput}
                />
              );
            })}
          </fieldset>
          <fieldset className="mt-5 border border-1 rounded-md flex flex-col gap-5 p-3">
            <legend className="font-semibold px-1">{t("contact")}</legend>

            <MainInput
              state={userInfo}
              setState={setUserInfo}
              required
              name="contactPhone"
              type="tel"
            />
          </fieldset>
        </div>
        <MainButton className="checkout-btn w-full mx-auto" type="submit">
          {t("requestOrder")}
        </MainButton>
      </form>
    </Modal>
  );
}
