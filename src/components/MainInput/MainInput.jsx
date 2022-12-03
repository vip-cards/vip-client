import { useEffect, useRef, useState } from "react";
import { t } from "i18next";
import i18n from "../../locales/i18n";

import { ReactComponent as EyeOPen } from "../../assets/VIP-ICON-SVG/eye_open.svg";
import { ReactComponent as EyeClose } from "../../assets/VIP-ICON-SVG/eye_close.svg";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./MainInput.scss";

export default function MainInput({
  name = "",
  type = "text",
  setState = () => {},
  state = {},
  list = [],
  identifier = "",
  required = false,
  disabled = false,
  toEdit = false,
  ...props
}) {
  const lang = i18n.language;
  const [showPassword, setShowPassword] = useState(false);
  const [disableState, setDisabledState] = useState(disabled);
  const inputRef = useRef(null);

  const toggleDisabledHandler = () => {
    setDisabledState((state) => !state);
  };
  const EditButton = () => {
    if (toEdit)
      return (
        <button
          type="button"
          className={["edit-field-icon", disableState ? null : "active"].join(
            " "
          )}
          onClick={toggleDisabledHandler}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      );
  };
  useEffect(() => {
    if (toEdit && !disableState) {
      inputRef.current && inputRef.current.focus();
    }
  }, [toEdit, disableState]);
  return type === "list" ? (
    <div className="main-input-label">
      <select
        required={required}
        disabled={disableState}
        className="main-input"
        selected={state[name]}
        value={state[name]}
        onChange={(e) => {
          setState({ ...state, [name]: e.target.value });
        }}
        onBlur={() => toEdit && setDisabledState(true)}
        name={name}
        id={name}
        ref={inputRef}
        placeholder="a"
        {...props}
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
      <EditButton />
    </div>
  ) : (
    <div className="main-input-label">
      {type === "password" ? (
        showPassword ? (
          <EyeOPen
            onClick={() => {
              setShowPassword((prev) => !prev);
            }}
            className="show-password-icon"
          />
        ) : (
          <EyeClose
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
        required={required}
        disabled={disableState}
        className="main-input"
        type={!type === "password" ? type : showPassword ? "text" : type}
        name={name}
        id={name}
        placeholder=" "
        ref={inputRef}
        onBlur={() => toEdit && setDisabledState(true)}
        {...props}
      />
      <label className="main-label" htmlFor={name}>
        {t(name)}
      </label>
      <EditButton />
    </div>
  );
}
