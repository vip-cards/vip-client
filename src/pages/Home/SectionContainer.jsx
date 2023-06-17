import {
  A11y,
  Autoplay,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import classNames from "classnames";

function SectionContainer({ items, className, direction, children }) {
  return (
    <section
      className={classNames(
        className,
        {
          "flex-col": direction === "col",
          "flex-row": direction === "row",
        },
        "w-full flex p-3 border rounded-lg gap-4 my-4 shadow-md max-sm:border-x-0 max-sm:rounded-none"
      )}
    >
      {children}
    </section>
  );
}

export default SectionContainer;
