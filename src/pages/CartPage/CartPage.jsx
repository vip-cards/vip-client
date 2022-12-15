import { useEffect } from "react";
import Axios from "../../services/Axios";
import store from "../../store";

export default function CartPage() {
  const userId = store.getState().auth.userId;

  useEffect(() => {
    Axios.get(`client/cart/get?client=${userId}`).then((res) =>
      console.log(res)
    );

    return () => {};
  }, []);

  return <>Cart Page</>;
}
