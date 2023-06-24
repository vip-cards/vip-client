import { getLocalizedWord } from "helpers/lang";
import { useTranslation } from "react-i18next";
import useSWRInfinite from "swr/infinite";
import FilterToggle from "./FilterToggle";

const FilterGroup = ({ title, filter, onToggle, listApi }) => {
  const _title = title.toLowerCase();
  const LIMIT = 5;
  const {
    data: listData,
    size,
    setSize,
  } = useSWRInfinite(
    (index) => [`all-${_title}s`, index + 1],
    ([_, page]) => listApi({ type: "vendor", page, limit: LIMIT })
  );
  const { t } = useTranslation();

  const list = listData ? listData.flatMap((arr) => arr.records) : [];
  const totalItems = listData ? listData?.[0].counts : 0;

  const group = filter?.[_title];
  const totalPages = Math.floor(totalItems / LIMIT);

  function handleLoadMore() {
    setSize(size + 1);
  }

  return (
    <div className="py-5 px-1 max-w-full">
      <h6 className="font-semibold capitalize">{title}</h6>
      {!!list?.length &&
        list?.map((item) => (
          <FilterToggle
            key={item._id + "-filter-item-" + _title}
            onToggle={(id) => onToggle(_title, id)}
            selected={group?.findIndex((q) => q === item._id) > -1}
            name={getLocalizedWord(item.name)}
            id={item._id}
          />
        ))}
      {!!list?.length && list.length < totalItems && (
        <div className="flex justify-center">
          <button
            className="border-2 border-gray-400 px-3 py-1 rounded-md mx-1"
            onClick={handleLoadMore}
          >
            {t("loadMore")}
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterGroup;
