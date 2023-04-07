import classNames from "classnames";
import { getLocalizedWord } from "helpers/lang";

export default function BannerCard({ banner }) {
  const { bannerSize } = banner;

  return (
    <div
      className={classNames(
        "module-card aspect-video overflow-hidden",
        "group",
        {
          "h-40": bannerSize === "medium",
          "h-28": bannerSize === "small",
        }
      )}
      onClick={() => {
        window.open(banner.link, "_blank");
      }}
    >
      <div className="overflow-hidden">
        <div className="">
          <img
            src={`${banner?.cover?.Location ?? banner?.image?.Location}`}
            alt="category-img"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/10 text-lg font-bold drop-shadow-sm group-hover:drop-shadow text-primary flex justify-center items-center group-hover:bg-transparent group-hover:text-white transition-colors">
          <p className="mt-auto mb-4 drop-shadow-lg ">
            {getLocalizedWord(banner.name)}
          </p>
        </div>
      </div>
    </div>
  );
}
