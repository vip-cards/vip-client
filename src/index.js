import "@fortawesome/fontawesome-free/css/all.min.css";
import ErrorBoundary from "layouts/ErrorBoundary/ErrorBoundary";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import store from "./store";
import "dayjs/locale/en";
import "dayjs/locale/ar";

import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/scss"; // core Swiperimport "swiper/css/navigation";
import "./index.scss";
import { SWRConfig } from "swr";

const helmetContext = {};
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

document.getElementById("loader-container")?.remove();

const isDev = () =>
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const swrOptions = isDev()
  ? {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  : Object.freeze({
      revalidateIfStale: true,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
      loadingTimeout: 5000,
      errorRetryCount: 5,
    });

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <HelmetProvider context={helmetContext}>
        <ErrorBoundary>
          <SWRConfig value={swrOptions}>
            <App />
          </SWRConfig>
        </ErrorBoundary>
      </HelmetProvider>
    </Provider>
  </BrowserRouter>
);
