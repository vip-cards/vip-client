import { useNavigate } from "react-router";
import { t } from "i18next";
import Carousel from "../../../components/Carousel/Carousel";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

export default function SectionView({ items, link, linkTitle, render }) {
  const navigate = useNavigate();
  if (!items || items.length <= 0) {
    return <LoadingSpinner />;
  }
  return (
    <div className="carousel-container">
      {!!link && (
        <div className="add-button-container">
          <button
            className="add-button"
            onClick={() => {
              navigate(link);
            }}
          >
            {t(linkTitle)}
          </button>
        </div>
      )}
      <Carousel
        data={items}
        autoplay={false}
        extraLarge={4.5}
        midLarge={4}
        large={3.5}
        medium={3}
        largeSmall={2.5}
        midSmall={2}
        extraSmall={1.25}
        render={render}
      />
    </div>
  );
}
