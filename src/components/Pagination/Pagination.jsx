import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { MainButton } from "components/Buttons";
import { getLocalizedNumber } from "helpers/lang";

function Pagination({ queryParams, setQueryParams, count }) {
  return (
    <footer className="p-8 flex flex-row gap-3 justify-center items-center mt-auto">
      <MainButton
        disabled={1 === queryParams.page}
        onClick={() =>
          setQueryParams((params) => ({
            ...params,
            page: params.page > 1 ? params.page - 1 : 1,
          }))
        }
        className="p-2 !rounded-full shrink-0 grow-0 w-6 h-6  justify-center items-center flex aspect-square disabled:bg-primary/50"
        size="small"
      >
        <FontAwesomeIcon
          className="rtl:rotate-180"
          icon={faCaretLeft}
          size="lg"
        />
      </MainButton>
      {[...Array.from({ length: count }, (v, i) => i + 1)]?.map((item) => (
        <MainButton
          key={item + "Pagination"}
          disabled={item === queryParams.page}
          onClick={() =>
            setQueryParams((params) => ({ ...params, page: item }))
          }
          className={classNames(
            {
              "!bg-primary/50": item !== queryParams.page,
            },
            "p-2 !rounded-full shrink-0 grow-0 w-6 h-6 justify-center items-center flex aspect-square"
          )}
          size="small"
        >
          {getLocalizedNumber(item)}
        </MainButton>
      ))}
      <MainButton
        disabled={count === queryParams.page}
        onClick={() =>
          setQueryParams((params) => ({
            ...params,
            page: params.page < count ? params.page + 1 : count,
          }))
        }
        className="p-2 !rounded-full shrink-0 grow-0 w-6 h-6  justify-center items-center flex aspect-square disabled:bg-primary/50"
        size="small"
      >
        <FontAwesomeIcon
          className="rtl:rotate-180"
          icon={faCaretRight}
          size="lg"
        />
      </MainButton>
    </footer>
  );
}

export default Pagination;
