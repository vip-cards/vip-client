import { ReactComponent as EyeClose } from "assets/VIP-ICON-SVG/eye_close.svg";
import { ReactComponent as EyeOPen } from "assets/VIP-ICON-SVG/eye_open.svg";
import classNames from "classnames";
import { getLocalizedWord } from "helpers/lang";
import { t } from "i18next";
import i18n from "locales/i18n";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import Select from "react-select";
import CheckboxInput from "./CheckboxInput";
import EditButton from "./EditButton";
import { ListInput } from "./ListInput";
import { InputSelect } from "./SelectInput";

import "./MainInput.scss";

interface IMainInputProps {
  name?: string;
  type?:
    | JSX.IntrinsicElements["input"]["type"]
    | "select"
    | "list"
    | "checkbox"
    | "password"
    | "number"
    | "date"
    | "multi-select"
    | "textarea";

  setState?: React.Dispatch<React.SetStateAction<any>>;
  state?: object;
  list?: any[];
  identifier?: string;
  required?: boolean;
  disabled?: boolean;
  toEdit?: boolean;
  invalid?: boolean;
  className?: string;
  dateRange?: "start" | "end";
  [x: string]: any;
}
export default function MainInput(props: IMainInputProps): JSX.Element {
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
    isMulti = true,
    className: _className,
    ...restProps
  } = props;

  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [disableState, setDisabledState] = useState(disabled);

  const lang = i18n.language;
  const className = classNames("main-input peer w-full", {
    error: invalid,
    "pointer-default": disableState || disabled,
  }); // input class names

  const toggleDisabledHandler = () => setDisabledState((state) => !state);

  const typeSwitch = useCallback(
    (type: IMainInputProps["type"]) => {
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
    },
    [name, showPassword, state]
  );

  const onBlurHandler = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (toEdit) setDisabledState(true);
    },
    [toEdit]
  );

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "checkbox") {
        setState({ ...state, [name]: e.target.checked });
      } else {
        setState({ ...state, [name]: e.target.value });
      }
    },
    [name, setState, state, type]
  );

  const renderInput = () => {
    const inputProps = {
      id,
      name,
      required,
      className,
      ref: inputRef,
      placeholder: " ",
      value: state[name],
      disabled: disableState,
      min: type === "number" ? 0 : null,
      autoComplete: type === "password" ? "off" : type,

      onBlur: onBlurHandler,
      onChange: onChangeHandler,

      ...typeSwitch(type),
      ...restProps,
    };

    switch (type) {
      case "date": {
        const _props = () => {
          switch (inputProps.dateRange) {
            case "start":
              return {
                selectsStart: true,
                startDate: state[name],
                endDate: state["endDate"],
                selected: state[name] ?? new Date(),
              };
            case "end":
              return {
                selectsEnd: true,
                startDate: state["startDate"],
                endDate: state[name],
                minDate: state["startDate"],
                selected: state[name] ?? state["startDate"] ?? new Date(),
              };
            default:
              return { selected: state[name] };
          }
        };

        return (
          <ReactDatePicker
            id={id}
            showIcon
            minDate={new Date()}
            calendarStartDay={6}
            showYearDropdown
            showMonthDropdown
            {...inputProps}
            {..._props()}
            onChange={(date: Date) =>
              setState((state: any) => ({
                ...state,
                [name]: date,
              }))
            }
          />
        );
      }
      case "multi-select":
        return (
          <Select
            isMulti={isMulti}
            options={list}
            isClearable={!disabled}
            value={state[name]}
            isSearchable={!disabled}
            isRtl={lang === "ar"}
            closeMenuOnSelect={false} //this is done for some reason
            isDisabled={disableState}
            classNamePrefix="multi-select"
            className="multi-select w-full"
            menuShouldScrollIntoView={true}
            placeholder={t("select")}
            styles={{
              control: (provided, state) => ({
                ...provided,
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                boxShadow: state.isFocused ? "0 0 0 1px #fc7300" : null,
                "&:hover": {
                  border: "1px solid #fc7300",
                },
              }),
              menu: (provided, state) => ({
                ...provided,
                zIndex: 100,
              }),
            }}
            getOptionLabel={(option) => getLocalizedWord(option[identifier])}
            getOptionValue={(option) => option._id}
            onChange={(selectedOptions) => {
              setState((state: any) => ({
                ...state,
                [name]: selectedOptions,
              }));
            }}
            {...restProps}
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
            state={state}
            setState={setState}
            identifier={identifier}
            {...inputProps}
          />
        );

      case "textarea":
        return <textarea {...inputProps} />;

      case "password":
        return (
          <PasswordInput
            inputProps={inputProps}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        );

      default:
        return <input {...inputProps} />;
    }
  };

  useEffect(() => {
    if (toEdit && !disableState && inputRef.current) inputRef.current.focus();
  }, [toEdit, disableState]);

  if (type === "select") {
    return (
      <InputSelect
        id={id}
        list={list}
        name={name}
        state={state}
        setState={setState}
        identifier={identifier}
        disabled={disableState}
        {...restProps}
      />
    );
  }
  console.log("from the input", state);
  console.log("from the input", list);
  return (
    <div className={classNames(_className, "main-input-label group")}>
      {renderInput()}
      <label
        className="main-label relative first-letter:capitalize"
        htmlFor={id}
      >
        {t(name) as string}
        <span className="text-red-600/80 pl-1 font-extrabold group-focus-within:!text-red text-lg -top-1 group-focus-within:font-black absolute ltr:-right-3 rtl:-left-3">
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

function PasswordInput({ showPassword = false, setShowPassword, inputProps }) {
  return (
    <>
      {showPassword ? (
        <EyeOPen
          onClick={() => {
            setShowPassword((prev: any) => !prev);
          }}
          className="show-password-icon"
        />
      ) : (
        <EyeClose
          onClick={() => {
            setShowPassword((prev: any) => !prev);
          }}
          className="show-password-icon"
        />
      )}
      <input {...inputProps} />
    </>
  );
}
