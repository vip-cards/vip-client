import React from "react";
import { IconButton, MainButton } from "components/Buttons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { MainInput } from "..";

const Search = ({ setSearchQuery, searchQuery, onClick }) => {
  return (
    <header className="flex flex-row  h-36 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 shadow rounded-b-xl">
      <div className="flex flex-row flex-nowrap justify-center items-center  gap-4 min-w-[200px] w-[70vw] mx-auto max-w-full">
        <MainInput
          name="search"
          className="flex-grow"
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={onClick}
          onKeyUp={(e) => e.code === "Enter" && onClick()}
          value={searchQuery}
        />
        <MainButton
          className="h-full aspect-square shadow-lg hover:shadow-md"
          onClick={onClick}
        >
          <IconButton icon={faMagnifyingGlass} variant="secondary" />
        </MainButton>
      </div>
    </header>
  );
};

export default Search;
