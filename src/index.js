import "@fortawesome/fontawesome-free/css/all.min.css";
import ErrorBoundary from "layouts/ErrorBoundary/ErrorBoundary";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "swiper/scss"; // core Swiper
import App from "./App";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import store from "./store";

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

reportWebVitals();
