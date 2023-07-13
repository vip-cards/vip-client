import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * InputSelect component props
 * @typedef {Object} InputSelectProps
 * @property {Object[]} list - An array of objects containing the list of items to display
 * @property {string} name - The name of the input field
 * @property {string} identifier - The unique identifier of each item in the list
 * @property {function} setState - A callback function to update the state with the selected item
 */

export const InputSelect = ({ list, name, identifier, setState, ...props }) => {
  const { t } = useTranslation();
  console.log(props);
  const state = props.state;
  const [selected, setSelected] = useState(state?.[name] ?? "");
  useEffect(() => {
    if (state[name] === undefined) return;
    if (state[name] === selected) return;
    setSelected(state[name]);
  }, [state, name, selected]);

  console.log(state, selected);
  return (
    <div className="main-input-select">
      <p className="field-title">{t(name)}</p>
      <div className="check-field">
        {list?.map((item, idx) => (
          <div
            className="form-check"
            key={idx}
            onClick={() => {
              setSelected(item[identifier]);
              setState((state) => ({
                ...state,
                [name]: item[identifier],
              }));
            }}
          >
            <label
              className="form-check-label w-full"
              htmlFor={item[identifier]}
            >
              <input
                type="radio"
                className="form-check-input"
                name="adSize"
                id={item[identifier]}
                checked={selected === item[identifier]}
                onChange={(e) => {
                  setSelected(item[identifier]);
                  setState((state) => ({
                    ...state,
                    [name]: item[identifier],
                  }));
                }}
                hidden
                {...props}
                disabled={props.disabled}
              />
              <span className="form-check-circle"></span>
              {t(item.name)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
