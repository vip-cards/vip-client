import ClientLayout from "layouts/ClientLayout/ClientLayout";
import i18n from "locales/i18n";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { EVENTS } from "services/socket/config";
import {
  listNotification,
  listenToNotification,
} from "services/socket/notification";
import { openOrderRoom } from "services/socket/order";
import { useSocket } from "services/socket/provider";
import { setNotifications } from "store/actions";

import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/scss"; // core Swiperimport "swiper/css/navigation";

export default function ProtectedRoute() {
  const auth = useSelector((state) => state.auth);
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.token || !isConnected) return;

    listenToNotification(() => {});

    listNotification();

    socket.on(EVENTS.NOTIFICATION.LIST, (response) => {
      setNotifications(response);
    });

    socket.on(EVENTS.CHAT.CREATE, (res) => {
      if (!res.success) {
        return;
      }

      const room = res.record;
      navigate("/chat", { state: { room } });
    });

    openOrderRoom((data) => {
      toast.info("Your latest order has an update!", {
        onClick: () => navigate("/account/orders-requests"),
        pauseOnHover: true,
        autoClose: 3400,
        hideProgressBar: true,
        closeOnClick: true,
        rtl: i18n.language === "ar",
        pauseOnFocusLoss: true,
        theme: "light",
        type: "info",
        position: "bottom-right",
        toastId: data?.records?.[0]?._id,
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token, isConnected, socket]);

  if (auth.token) {
    return <ClientLayout />;
  } else {
    return <Navigate to="/login" />;
  }
}
