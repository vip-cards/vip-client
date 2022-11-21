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
  small,
  data = [],
  pagination,
  render,
  autoplay = true,
}) {
  return (
    <div className="slider-component">
      <Swiper
        breakpoints={{
          1200: {
            slidesPerView: extraLarge || 3,
            spaceBetween: 20,
          },

          992: {
            slidesPerView: midLarge || 3,
            spaceBetween: 20,
          },

          892: {
            slidesPerView: large || 2,
            spaceBetween: 20,
          },
          576: {
            slidesPerView: medium || 2,
            spaceBetween: 20,
          },
          350: {
            slidesPerView: small || 1,
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
      >
        {data.map((item, i) => (
          <SwiperSlide key={i}>{render && render(item)}</SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
