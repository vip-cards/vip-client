import { t } from "i18next";
import i18n from "locales/i18n";
import { forwardRef } from "react";

export const ListInput = forwardRef(function ListInput(
  {
    list,
    name,
    identifier,
    disabled,
    setDisabledState,
    toEdit,
    state,
    setState,
  },
  inputRef
) {
  const lang = i18n.language;
  console.log(state);
  return (
    <>
      <select
        required
        disabled={disabled}
        className="main-input"
        selected={state[name] ?? ""}
        value={state[name] || "0"}
        onChange={(e) => {
          setState({ ...state, [name]: e.target.value });
        }}
        name={name}
        id={name}
        placeholder="a"
        ref={inputRef}
        onBlur={() => toEdit && setDisabledState(true)}
      >
        <option disabled value="0">
          {t("choose")}
        </option>

        {list?.length &&
          list?.map((li) => {
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
    </>
  );
});
