import {
  A11y,
  Autoplay,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
  Virtual,
} from "swiper";
import { Swiper } from "swiper/react";

const HomeSwiper = ({ children, ...props }) => {
  return (
    <Swiper
      loop
      autoplay={process.env.NODE_ENV !== "production" ? false : { delay: 5000 }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      mousewheel={false}
      modules={[
        A11y,
        Mousewheel,
        Keyboard,
        Navigation,
        Autoplay,
        Pagination,
        Virtual,
      ]}
      centeredSlides
      navigation
      centeredSlidesBounds
      rewind
      className="p-4 h-full w-full"
      {...props}
    >
      {children}
      <div
        className="swiper-pagination"
        style={{
          position: "absolute",
          bottom: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      ></div>
    </Swiper>
  );
};
export default HomeSwiper;
