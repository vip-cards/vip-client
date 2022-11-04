import { t } from "i18next";
import React from "react";
import i18n from "../../locales/i18n";
import "./MainInput.scss";

export default function MainInput({
  name = "",
  type = "text",
  setState = () => {},
  state = {},
  list = [],
  identifier = "",
  required = false,
}) {
  const lang = i18n.language;
  return type === "list" ? (
    <div className="main-input-label">
      <select
        required
        className="main-input"
        selected={state[name]}
        value={state[name]}
        onChange={(e) => {
          setState({ ...state, [name]: e.target.value });
        }}
        name={name}
        id={name}
        placeholder="a"
      >
        {list.map((li) => {
          return (
            <option key={li._id} value={li._id}>
              {li[identifier][lang]}
            </option>
          );
        })}
      </select>
      <label className="main-label" htmlFor={name}>
        {t(name)}
      </label>
    </div>
  ) : (
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
