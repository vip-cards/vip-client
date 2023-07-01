import { MainImage } from "components";
import CardContainer from "components/CardContainer/CardContainer";
import HomeSwiper from "pages/Home/HomeSwiper";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { SwiperSlide } from "swiper/react";

export interface IPreviewProps {}

export default function Preview(props: IPreviewProps) {
  const { t } = useTranslation();
  const { state } = useLocation();

  return (
    <CardContainer title="" className="flex flex-col gap-5 max-w-5xl mx-auto">
      {/* --- */}
      <section>
        <h4>{t("largeBanner")}</h4>
        <div className="flex-grow h-72 min-w-[200px] rounded-xl overflow-hidden flex justify-center items-center max-w-full">
          <HomeSwiper
            direction="horizontal"
            slidesPerView={1}
            style={{ height: "100%" }}
            spaceBetween={20}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              renderBullet: function (index, className) {
                return `<span class="${className} bg-primary" style=""></span>`;
              },
            }}
          >
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
              {/* <div className="w-full h-full flex-col text-white/70 font-semibold gap-1 bg-gray-300 flex justify-center items-center">
                <FontAwesomeIcon
                  icon={faImage}
                  className="text-white/70"
                  size="5x"
                />
                <p>{t("uploadImage")}</p>
              </div> */}
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
          </HomeSwiper>
        </div>
      </section>
      {/* --- */}
      <section className="border-t border-t-black/10 mt-4">
        <h4>{t("mediumBanner")}</h4>
        <div className="flex-grow h-72 min-w-[200px] rounded-xl overflow-hidden flex justify-center items-center max-w-full">
          <HomeSwiper
            direction="horizontal"
            style={{ height: "100%" }}
            spaceBetween={20}
            breakpoints={{
              300: { slidesPerView: 1.2 },
              480: { slidesPerView: 1.5 },
              540: { slidesPerView: 1.8 },
              768: { slidesPerView: 2.4 },
              860: { slidesPerView: 2.8 },
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              renderBullet: function (index, className) {
                return `<span class="${className} bg-primary" style=""></span>`;
              },
            }}
          >
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
          </HomeSwiper>
        </div>
      </section>
      {/* --- */}
      <section className="border-t border-t-black/10 mt-4">
        <h4>{t("smallBanner")}</h4>
        <div className="flex-grow h-40 min-w-[200px] rounded-xl overflow-hidden flex justify-center items-center max-w-full">
          <HomeSwiper
            direction="horizontal"
            style={{ height: "100%" }}
            spaceBetween={20}
            breakpoints={{
              300: { slidesPerView: 1.2 },
              480: { slidesPerView: 1.5 },
              540: { slidesPerView: 1.8 },
              768: { slidesPerView: 2.5 },
              860: { slidesPerView: 2.9 },
              992: { slidesPerView: 3.2 },
            }}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              renderBullet: function (index, className) {
                return `<span class="${className} bg-primary" style=""></span>`;
              },
            }}
          >
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
            <SwiperSlide className="w-full h-full rounded-xl shadow overflow-hidden">
              <MainImage src={state?.imgUrl} />
            </SwiperSlide>
          </HomeSwiper>
        </div>
      </section>
    </CardContainer>
  );
}
