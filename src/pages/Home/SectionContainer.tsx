// Import Swiper styles
import classNames from "classnames";
import { useIntersectionObserver } from "helpers/useIntersectionObserver";
import { useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface SectionContainerProps {
  className?: string;
  direction?: "col" | "row";
  children: React.ReactNode;
}

function SectionContainer({
  className,
  direction,
  children,
}: SectionContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {
    rootMargin: "300px",
    freezeOnceVisible: true,
  });
  const isVisible = !!entry?.isIntersecting;

  return (
    <section
      ref={ref}
      className={classNames(
        className,
        {
          "flex-col": direction === "col",
          "flex-row": direction === "row",
        },
        {
          "opacity-0 translate-y-10": !isVisible,
          "opacity-100 translate-y-0": isVisible,
        },
        "w-full flex min-h-[10rem] transition-all xs:p-3 border rounded-lg gap-4 my-4 shadow-sm xs:shadow-md max-sm:border-x-0 max-sm:rounded-none"
      )}
    >
      {isVisible ? children : null}
    </section>
  );
}

export default SectionContainer;
