import { ReactComponent as EyeClose } from "assets/VIP-ICON-SVG/eye_close.svg";
import { ReactComponent as EyeOPen } from "assets/VIP-ICON-SVG/eye_open.svg";
import classNames from "classnames";
import { getLocalizedWord } from "helpers/lang";
import { t } from "i18next";
import { useEffect, useId, useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import CheckboxInput from "./CheckboxInput";
import EditButton from "./EditButton";
import { ListInput } from "./ListInput";
import "./MainInput.scss";
import { InputSelect } from "./SelectInput";

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
        id={inputId}
        list={list}
        name={name}
        identifier={identifier}
        setState={setState}
        {...restProps}
      />
    );

  const renderInput = () => {
    const typeSwitch = () => {
      switch (type) {
        case "list":
          return { selected: state[name] };
        case "checkbox":
          return { checked: state[name] };
        case "password":
          return { type: !showPassword ? "password" : "text" };
        default:
          return { type };
      }
    };

    const inputProps = {
      name,
      required,
      ...typeSwitch(),
      id: inputId,
      ref: inputRef,
      value: state[name],
      disabled: disableState,
      className: classNames("main-input peer", { error: invalid }),
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
      case "date":
        return (
          <ReactDatePicker
            id={inputId}
            showIcon
            minDate={new Date()}
            calendarStartDay={6}
            showYearDropdown
            showMonthDropdown
            {...inputProps}
            {...(inputProps.dateRange === "start"
              ? {
                  selectsStart: true,
                  startDate: state[name],
                  endDate: state["endDate"],
                  selected: state[name] ?? new Date(),
                }
              : inputProps.dateRange === "end"
              ? {
                  selectsEnd: true,
                  startDate: state["startDate"],
                  endDate: state[name],
                  minDate: state["startDate"],
                  selected: state[name] ?? state["startDate"] ?? new Date(),
                }
              : { selected: state[name] })}
            onChange={(date) =>
              setState((state) => ({
                ...state,
                [name]: date,
              }))
            }
          />
        );
      case "multi-select":
        return (
          <Select
            id={inputId}
            closeMenuOnSelect={false}
            className="multi-select w-full"
            classNamePrefix="multi-select"
            isMulti
            isDisabled={disableState}
            options={list}
            getOptionLabel={(option) => getLocalizedWord(option[identifier])}
            getOptionValue={(option) => getLocalizedWord(option._id)}
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
          <CheckboxInput
            list={list}
            identifier={identifier}
            state={state}
            setState={setState}
            {...inputProps}
          />
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
    <div className={classNames(className, "main-input-label group")}>
      {renderInput()}
      <label className="main-label relative" htmlFor={inputId}>
        {t(name)}
        <span className="text-red-600/80 pl-1 font-extrabold group-focus-within:text-white group-focus-within:font-black">
          {required ? " * " : ""}
        </span>
      </label>
      <EditButton
        toEdit={toEdit}
        disableState={disableState}
        toggleDisabledHandler={toggleDisabledHandler}
      />
    </div>
  );
}
