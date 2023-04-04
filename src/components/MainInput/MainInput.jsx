import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { ReactComponent as EyeClose } from "../../assets/VIP-ICON-SVG/eye_close.svg";
import { ReactComponent as EyeOPen } from "../../assets/VIP-ICON-SVG/eye_open.svg";
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
  disabled = false,
  toEdit = false,
  className,
  ...props
}) {
  const lang = i18n.language;
  const [showPassword, setShowPassword] = useState(false);
  const [disableState, setDisabledState] = useState(disabled);
  const inputRef = useRef(null);

  const toggleDisabledHandler = () => setDisabledState((state) => !state);

  const EditButton = () => {
    if (toEdit)
      return (
        <button
          type="button"
          className={classNames("edit-field-icon", { active: !disableState })}
          onClick={toggleDisabledHandler}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      );
    else return null;
  };

  const renderInput = () => {
    const inputProps = {
      name,
      required,

      ...(type === "list"
        ? { selected: state[name] }
        : {
            type: type === "password" && !showPassword ? "password" : "text",
          }),

      id: name,
      ref: inputRef,
      value: state[name],
      disabled: disableState,
      className: "main-input",
      placeholder: " ",

      onBlur: () => toEdit && setDisabledState(true),
      onChange: (e) => setState({ ...state, [name]: e.target.value }),

      ...props,
    };

    switch (type) {
      case "list":
        return (
          <select {...inputProps}>
            {list.length &&
              list.map((li) => (
                <option key={li._id} value={li._id}>
                  {li[identifier][lang]}
                </option>
              ))}
          </select>
        );

      case "textarea":
        return <textarea {...inputProps} />;

      case "password":
        return (
          <>
            {showPassword ? (
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
            )}
            <input {...inputProps} />
          </>
        );
      default:
        return <input {...inputProps} type={type} />;
    }
  };

  useEffect(() => {
    if (toEdit && !disableState) inputRef.current && inputRef.current.focus();
  }, [toEdit, disableState]);
  
  return (
    <div className={classNames(className, "main-input-label")}>
      {renderInput()}
      <label className="main-label" htmlFor={name}>
        {t(name)}
      </label>
      <EditButton />
    </div>
  );
}
