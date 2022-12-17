import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { HelmetProvider } from "react-helmet-async";

const helmetContext = {};
const root = ReactDOM.createRoot(document.getElementById("root"));
document.getElementById("loader-container")?.remove();

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <HelmetProvider context={helmetContext}>
        <App />
      </HelmetProvider>
    </Provider>
  </BrowserRouter>
);

reportWebVitals();
