import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { t } from "i18next";
import { useEffect, useId, useRef, useState } from "react";
import { ReactComponent as EyeClose } from "../../../assets/VIP-ICON-SVG/eye_close.svg";
import { ReactComponent as EyeOPen } from "../../../assets/VIP-ICON-SVG/eye_open.svg";
import { ListInput } from "./ListInput";
import { InputSelect } from "./SelectInput";

import "./MainInput.scss";

export default function MainInput(props) {
  const {
    name = "",
    type = "text",
    setState = () => {},
    state = {},
    list = [],
    identifier = "",
    required = false,
    disabled = false,
    toEdit = false,
    invalid = false,
    className,
    ...restProps
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [disableState, setDisabledState] = useState(disabled);
  const inputRef = useRef(null);
  const inputId = useId();

  const toggleDisabledHandler = () => setDisabledState((state) => !state);

  useEffect(() => {
    if (toEdit && !disableState) inputRef.current && inputRef.current.focus();
  }, [toEdit, disableState]);

  if (type === "select")
    return (
      <InputSelect
        list={list}
        name={name}
        identifier={identifier}
        setState={setState}
        {...restProps}
      />
    );

  const renderInput = () => {
    const inputProps = {
      name,
      required,
      ...(type === "list"
        ? { selected: state[name] }
        : {
            type:
              (type === "password" && (!showPassword ? "password" : "text")) ||
              type,
          }),
      id: name,
      ref: inputRef,
      value: state[name],
      disabled: disableState,
      className: classNames("main-input", { error: invalid }),
      placeholder: " ",
      min: type === "number" ? 0 : null,
      autoComplete: type === "password" ? "off" : type,

      onBlur: () => toEdit && setDisabledState(true),
      onChange: (e) => setState({ ...state, [name]: e.target.value }),

      ...restProps,
    };

    switch (type) {
      case "list":
        return (
          <ListInput
            list={list}
            identifier={identifier}
            state={state}
            setState={setState}
            {...inputProps}
          />
        );

      case "textarea":
        return <textarea {...inputProps}  />;

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
        return <input {...inputProps} />;
    }
  };

  return (
    <div className={classNames(className, "main-input-label")}>
      {renderInput()}
      <label className="main-label" htmlFor={name}>
        {t(name)}
      </label>
      <EditButton
        toEdit={toEdit}
        disableState={disableState}
        toggleDisabledHandler={toggleDisabledHandler}
      />
    </div>
  );
}

const EditButton = ({ toEdit, disableState, toggleDisabledHandler }) =>
  !!toEdit && (
    <button
      type="button"
      className={classNames("edit-field-icon", {
        active: !disableState,
      })}
      onClick={toggleDisabledHandler}
    >
      <FontAwesomeIcon icon={faPenToSquare} />
    </button>
  );
