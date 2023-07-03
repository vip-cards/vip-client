import { useTranslation } from "react-i18next";
import Select from "react-select";
import type { ISearchProps } from "./search.type";

function SearchTypeSelector({
  types,
  setQueryParams,
}: {
  types: ISearchProps["types"];
  setQueryParams: ISearchProps["setQueryParams"];
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Select
      autoFocus
      isClearable
      isSearchable
      isMulti={false}
      closeMenuOnScroll
      closeMenuOnSelect
      blurInputOnSelect
      hideSelectedOptions
      defaultMenuIsOpen={false}
      menuShouldScrollIntoView={true}
      //
      isRtl={lang === "ar"}
      name="list-selector"
      placeholder={t("select")}
      className="w-40 max-w-60 max-sm:w-[90%] max-sm:max-w-[90%]"
      classNamePrefix="list-select"
      getOptionValue={(option) => option.value}
      getOptionLabel={(option) => t(option.label)}
      options={types.map((type) => ({ value: type, label: type }))}
      //
      styles={{
        control: (provided, state) => ({
          ...provided,
          height: "2.5rem",
          borderRadius: "0.7rem",
          border: "1px solid #e2e8f0",
          boxShadow: state.isFocused ? "0 0 0 1px #fc7300" : null,
          "&:hover": { border: "1px solid #fc7300" },
        }),

        menu: (provided) => ({
          ...provided,
          zIndex: 100,
        }),
      }}
      onChange={(val) =>
        setQueryParams((q) => ({ ...q, type: val?.value ?? "" }))
      }
    />
  );
}

export default SearchTypeSelector;
