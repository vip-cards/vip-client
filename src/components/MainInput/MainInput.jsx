import { t } from "i18next";
import React from "react";
import "./MainInput.scss";

export default function MainInput({
  name = "",
  type = "text",
  setState = () => {},
  state = {},
  required = false,
}) {
  return (
    <div className="main-input-label">
      <input
        value={state[name]}
        onChange={(e) => {
          setState({ ...state, [name]: e.target.value });
        }}
        required
        className="main-input"
        type={type}
        name={name}
        id={name}
        placeholder=" "
      />
      <label className="main-label" htmlFor={name}>
        {t(name)}
      </label>
    </div>
  );
}
