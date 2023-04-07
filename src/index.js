import "@fortawesome/fontawesome-free/css/all.min.css";
import ErrorBoundary from "layouts/ErrorBoundary/ErrorBoundary";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import store from "./store";

import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/scss"; // core Swiperimport "swiper/css/navigation";
import "./index.scss";

const helmetContext = {};
const root = ReactDOM.createRoot(document.getElementById("root"));
document.getElementById("loader-container")?.remove();

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <HelmetProvider context={helmetContext}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </HelmetProvider>
    </Provider>
  </BrowserRouter>
);
