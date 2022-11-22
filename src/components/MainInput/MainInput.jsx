import { t } from "i18next";
import React, { useState } from "react";
import i18n from "../../locales/i18n";
import { ReactComponent as EyeOPen } from "../../assets/VIP-ICON-SVG/eye_open.svg";
import { ReactComponent as EyeClose } from "../../assets/VIP-ICON-SVG/eye_close.svg";
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
  const [showPassword, setShowPassword] = useState(false);

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
      {type === "password" ? (
        showPassword ? (
          <EyeClose
            onClick={() => {
              setShowPassword((prev) => !prev);
            }}
            className="show-password-icon"
          />
        ) : (
          <EyeOPen
            onClick={() => {
              setShowPassword((prev) => !prev);
            }}
            className="show-password-icon"
          />
        )
      ) : null}
      <input
        value={state[name]}
        onChange={(e) => {
          setState({ ...state, [name]: e.target.value });
        }}
        required
        className="main-input"
        type={!type === "password" ? type : showPassword ? "text" : type}
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
