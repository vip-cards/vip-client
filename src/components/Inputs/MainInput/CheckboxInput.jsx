import { useTranslation } from "react-i18next";

export default function CheckboxInput({
  list,
  id,
  identifier,
  state,
  name,
  setState,
}) {
  const { t } = useTranslation();

  return (
    <div className="check-group">
      {!!list.length &&
        list.map((item) => (
          <div key={id + item[identifier]} className="flex items-center mb-4">
            <input
              id={id}
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
            <label htmlFor={id} className="ml-2">
              {t(item.name)}
            </label>
          </div>
        ))}
    </div>
  );
}
