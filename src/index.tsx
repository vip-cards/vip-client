import ErrorBoundary from "layouts/ErrorBoundary/ErrorBoundary";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import App from "./App";
import store from "./store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import "dayjs/locale/ar";
import "dayjs/locale/en";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "animate.css";
import "react-datepicker/dist/react-datepicker.css";

import "./index.scss";

dayjs.extend(relativeTime);
const helmetContext = {};
const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

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
      revalidateIfStale: false,
      revalidateOnMount: true,
      revalidateOnFocus: true,
      dedupingInterval: 1000 * 60 * 60 * 24,
      loadingTimeout: 5000,
      errorRetryCount: 3,
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
