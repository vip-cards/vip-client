import classNames from "classnames";
import { getLocalizedWord } from "helpers/lang";

export default function BannerCard({ banner }) {
  const { bannerSize } = banner;

  return (
    <div
      className={classNames("category-card  aspect-video overflow-hidden", {
        "h-40": bannerSize === "medium",
        "h-28": bannerSize === "small",
      })}
      onClick={() => {
        window.open(banner.link, "_blank");
      }}
    >
      <div className="overflow-hidden">
        <div className="">
          <img
            src={`${banner?.image?.Location ?? banner?.image?.url}`}
            alt="category-img"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/10 text-lg font-bold drop-shadow-sm hover:drop-shadow text-primary/70 flex justify-center items-center hover:bg-transparent hover:text-white transition-colors">
          <p className="mt-auto mb-4">{getLocalizedWord(banner.name)}</p>
        </div>
      </div>
    </div>
  );
}
