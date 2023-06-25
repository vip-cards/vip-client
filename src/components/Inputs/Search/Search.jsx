import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { IconButton, MainButton } from "components/Buttons";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { MainInput } from "..";

const Search = ({ setSearchQuery, onClick }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const debouncedOnChange = debounce(setSearchQuery, 500);
    debouncedOnChange(value);

    return () => debouncedOnChange.cancel();
  }, [value]);

  return (
    <header className="flex flex-row h-24 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 shadow rounded-b-xl">
      <div className="flex flex-row flex-nowrap justify-center items-center  gap-4 min-w-[200px] w-[70vw] mx-auto max-w-full">
        <MainInput
          name="search"
          className="flex-grow focus-within:-translate-y-1 scale-90 focus-within:scale-100 transition-transform focus-within:drop-shadow-lg duration-200 ease-in-out"
          onChange={(e) => setValue(e.target.value)}
          onKeyUp={(e) => e.code === "Enter" && onClick()}
          value={value}
        />
        <div>
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
