import { useState } from "react";
import { useTranslation } from "react-i18next";

export const InputSelect = ({ list, name, identifier, setState, ...props }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState();
  return (
    <div className="main-input-select">
      <p className="field-title">{t(name)}</p>
      <div className="check-field">
        {list?.map((item, idx) => (
          <div className="form-check" key={idx}>
            <label
              className="form-check-label"
              htmlFor={item[identifier] + props.id}
            >
              <input
                type="radio"
                className="form-check-input"
                name="adSize"
                id={item[identifier] + props.id}
                checked={selected === item[identifier]}
                onChange={(e) => {
                  setSelected(item[identifier]);
                  setState((state) => ({
                    ...state,
                    [name]: item[identifier],
                  }));
                }}
                hidden
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
