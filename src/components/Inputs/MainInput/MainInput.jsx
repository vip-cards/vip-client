import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as EyeClose } from "assets/VIP-ICON-SVG/eye_close.svg";
import { ReactComponent as EyeOPen } from "assets/VIP-ICON-SVG/eye_open.svg";
import classNames from "classnames";
import { t } from "i18next";
import { useEffect, useId, useRef, useState } from "react";
import Select from "react-select";
import { ListInput } from "./ListInput";
import { InputSelect } from "./SelectInput";

import "./MainInput.scss";
import { getLocalizedWord } from "helpers/lang";

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
        : type === "checkbox"
        ? { checked: state[name] }
        : {
            type: type === "password" && !showPassword ? "password" : "text",
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
      ...(type === "checkbox" && {
        onChange: (e) => setState({ ...state, [name]: e.target.checked }),
      }),

      ...restProps,
    };

    switch (type) {
      case "multi-select":
        return (
          <Select
            closeMenuOnSelect={false}
            className="multi-select w-full"
            classNamePrefix="multi-select"
            isMulti
            isDisabled={disableState}
            options={list}
            getOptionLabel={(option) => {
              console.log(option);
              return getLocalizedWord(option[identifier]);
            }}
            getOptionValue={(option) => {
              console.log(option);
              return getLocalizedWord(option._id);
            }}
            value={state[name]}
            onChange={(selectedOptions) =>
              setState((state) => ({
                ...state,
                [name]: selectedOptions,
              }))
            }
          />
        );
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

      case "checkbox":
        return (
          <div className="check-group">
            {!!list.length &&
              list.map((item) => (
                <div
                  key={inputId + item[identifier]}
                  className="flex items-center mb-4"
                >
                  <input
                    id={inputId + item[identifier]}
                    type="checkbox"
                    value={item[identifier]}
                    defaultChecked={item.isChecked}
                    className="check-input w-4 h-4 rounded-xl overflow-hidden"
                    onChange={(e) => {
                      const currentSelectionArr = state?.[name] ?? [item.value];

                      const idx = currentSelectionArr.findIndex(
                        (q) => q === item.value
                      );
                      // check if in array of selections in the state
                      if (!e.target.checked) {
                        currentSelectionArr.splice(idx, 1);
                      } else {
                        currentSelectionArr.push(item.value);
                      }
                      setState((state) => ({
                        ...state,
                        [name]: [...currentSelectionArr],
                      }));
                    }}
                  />
                  <label htmlFor={inputId + item[identifier]} className="ml-2">
                    {item.name}
                  </label>
                </div>
              ))}
          </div>
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
