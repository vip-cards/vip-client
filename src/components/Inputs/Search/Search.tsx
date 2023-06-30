import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { IconButton, MainButton } from "components/Buttons";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { MainInput } from "..";
import SearchTypeSelector from "./SearchTypeSelector";
import type { ISearchProps } from "./search.type";

const Search: React.FC<ISearchProps> = (props) => {
  const { setSearchQuery, onClick, types, withSelector, setQueryParams } =
    props.withSelector ? (props as Required<ISearchProps>) : props;

  const [value, setValue] = useState("");

  useEffect(() => {
    const debouncedOnChange = debounce(setSearchQuery, 500);
    debouncedOnChange(value);

    return () => debouncedOnChange.cancel();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <header className="flex flex-row h-24 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 shadow rounded-b-xl">
      <div className="flex flex-row flex-nowrap justify-center items-center gap-1 min-w-[200px] w-[70vw] mx-auto max-w-full px-5">
        <div className="flex flex-row gap-1 flex-nowrap items-center justify-center w-full">
          {withSelector && types.length ? (
            <SearchTypeSelector types={types} setQueryParams={setQueryParams} />
          ) : (
            <></>
          )}

          <MainInput
            name="search"
            className="flex-grow focus-within:-translate-y-1 scale-90 focus-within:scale-100 transition-transform focus-within:drop-shadow-lg duration-200 ease-in-out"
            onChange={(e) => setValue(e.target.value)}
            onKeyUp={(e) => e.code === "Enter" && onClick()}
            value={value}
          />
        </div>

        <div className="">
          <MainButton
            className="h-full aspect-square shadow-lg hover:shadow-md"
            onClick={onClick}
          >
            <IconButton icon={faMagnifyingGlass} variant="secondary" />
          </MainButton>
        </div>
      </div>
    </header>
  );
};

export default Search;
