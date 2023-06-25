import classNames from "classnames";

const FilterToggle = ({ name = "filter", onToggle, selected = false, id }) => {
  const handleFilterToggle = () => onToggle(id);

  return (
    <button
      className="group max-w-full pb-1 flex flex-row w-full flex-nowrap justify-between items-center my-1 px-2 border-b-[1px] border-slate-400"
      onClick={handleFilterToggle}
    >
      <p className="text-lg whitespace-nowrap max-w-[8rem] text-ellipsis overflow-hidden">
        {name}
      </p>
      <div
        className={classNames(
          "aspect-square w-4 h-4 rounded-full border-2 border-black",
          {
            "bg-primary": selected,
            "bg-transparent group-hover:bg-primary/50": !selected,
          }
        )}
      ></div>
    </button>
  );
};

export default FilterToggle;
