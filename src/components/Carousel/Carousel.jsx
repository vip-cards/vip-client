import { Swiper, SwiperSlide } from "swiper/react";
import "./Carousel.scss";

// Import Swiper styles
import "swiper/css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Mousewheel,
  Keyboard,
  Autoplay,
} from "swiper";

export default function Carousel({
  extraLarge,
  midLarge,
  large,
  medium,
  largeSmall,
  midSmall,
  extraSmall,
  data = [],
  pagination,
  render,
  autoplay = true,
}) {
  return (
    <div className="slider-component">
      <Swiper
        breakpoints={{
          1250: {
            slidesPerView: extraLarge || 3,
            spaceBetween: 20,
          },

          1150: {
            slidesPerView: midLarge || 3,
            spaceBetween: 20,
          },

          992: {
            slidesPerView: large || 2,
            spaceBetween: 20,
          },
          877: {
            slidesPerView: medium || 2,
            spaceBetween: 20,
          },
          721: {
            slidesPerView: largeSmall || 1,
            spaceBetween: 20,
          },
          480: {
            slidesPerView: midSmall || 1,
            spaceBetween: 20,
          },
          300: {
            slidesPerView: extraSmall || 1,
            spaceBetween: 20,
          },
        }}
        dir="ltr"
        modules={[
          Navigation,
          Pagination,
          Scrollbar,
          A11y,
          Mousewheel,
          Keyboard,
          Autoplay,
        ]}
        autoplay={autoplay === false ? autoplay : { delay: 1500 }}
        mousewheel={false}
        keyboard={{ enabled: true }}
        spaceBetween={20}
        // pagination={pagination}
        // slidesPerView={4}
        navigation
        freeMode={true}
        centeredSlides
        centeredSlidesBounds
        rewind
      >
        {data.map((item, i) => (
          <SwiperSlide key={i}>{render && render(item)}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
