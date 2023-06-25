import categoryPlaceholder from "assets/images/categoreyPlaceHolder.png";
import { getLocalizedWord } from "helpers/lang";
import { Link } from "react-router-dom";
import "./CategoryCard.scss";

interface ICategoryCardProps {
  category: IProductCategory;
  vendorId?: string;
}

export default function CategoryCard({
  category,
  vendorId,
}: ICategoryCardProps) {
  return (
    <Link
      className="category-card"
      to={
        vendorId
          ? `/vendors/${vendorId}/category/${category._id}`
          : `/categories/${category._id}`
      }
    >
      <div className="category-info-container">
        <div className="category-img-container">
          <img
            src={`${category?.image?.Location ?? categoryPlaceholder}`}
            alt="category-img"
            className="category-img"
          />
        </div>
        <div className="category-title capitalize">
          <p>{getLocalizedWord(category.name)} </p>
        </div>
      </div>
    </Link>
  );
}
